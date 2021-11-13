import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Message from './message.entity';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from './channel.entity';
import CreateChannelDto from './dto/createChannel.dto';
import UsersService from '../users/users.service';
import PasswordDto from './dto/password.dto';
import muteObj from './mute.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class ChannelService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(muteObj)
    private muteObjRepository: Repository<muteObj>,
    private usersService: UsersService,
  ) {
  }

  //called from a websocket
  async saveMessage(content: string, author: User, recipient: Channel) {
    const newMessage = await this.messagesRepository.create({
      content,
      author,
      recipient
    });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async deleteMessages(recipient: Channel) {
    recipient.historic = []
    await this.channelRepository.save(recipient)
  }

  async getMessageByChannel(channel: Channel) {
    return this.messagesRepository.find({
      where: { recipient: channel },
      relations: ["author"],
      order: {
        lastupdate: "ASC"
      }
    });
  }

  async getMessagesByChannelId(channel_id: number, user_id: number) {
    const channel = await this.channelRepository.findOne({ id: channel_id });
    await this.checkMuteTime(channel);
    if ((await this.isAMember(channel_id, user_id) || (await this.usersService.isSiteAdmin(user_id)))) {
      return await this.getMessageByChannel(channel);
    }
    throw new HttpException('Only members and site admins can see messages of a channel', HttpStatus.FORBIDDEN);
  }

  //OPEN ROUTE FOR NOW. At the end only for site admins
  async getAllMessagesOfAllChannels() {
    return await this.messagesRepository.find();
  }

  async getNextExpiredMuteDate(muteObjs: muteObj[]) {
    if (!muteObjs || !muteObjs[0])
      return null;
    let next = muteObjs[0].silencedUntil;
    for (var muteObj of muteObjs) {
      if (muteObj.silencedUntil < next)
        next = muteObj.silencedUntil;
    }
    return next;
  }

  async getNextUnmuteDate(channel_id: number){
    let channel = await this.getAllInfosByChannelId(channel_id);
    return await this.getNextExpiredMuteDate(channel.muteDates);
  }

  async refreshMutedUsers(channel: & Channel) {
    let date = await this.getNextExpiredMuteDate(channel.muteDates);
    while (date !== null && BigInt(date) < BigInt(Date.now())) {
      let dateIndex = channel.muteDates.findIndex(muteObj => muteObj.silencedUntil === date);
      let user_id = channel.muteDates[dateIndex].userId;
      let userIndex = channel.muted.findIndex(user => user.id === user_id);
      channel.muteDates.splice(dateIndex, 1);
      channel.muted.splice(userIndex, 1);
      date = await this.getNextExpiredMuteDate(channel.muteDates);
    }
    channel.next_unmute_date = date;
    await this.channelRepository.save(channel);
    return channel;
  }

  async checkMuteTime(channel: & Channel) {
    if (channel
      && channel.next_unmute_date
      && channel.next_unmute_date < String(Date.now()))
      (await this.refreshMutedUsers(channel));
  }

    //
  async getAllChannels(user_is: Number) {
  //  if (await this.usersService)
    let channels = await this.channelRepository.find({ relations: ['historic', 'members', 'muted', 'muteDates', 'admins', 'owner'] });
    if (channels) {
      for (var channel of channels)
        await this.checkMuteTime(channel);
      channels = await this.channelRepository.find({ relations: ['historic', 'members', 'muted', 'muteDates', 'admins', 'owner'] });
      return channels;
    }
    throw new HttpException('No channel has been created yet', HttpStatus.NOT_FOUND);
  }

  //
  async getChannelById(id: number) {
    let channel = await this.channelRepository.findOne(id);
    if (channel) {
      await this.checkMuteTime(channel);
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  //
  async getChannelByName(name: string) {
    let channel = await this.channelRepository.findOne({ name });
    if (channel) {
      await this.checkMuteTime(channel);
      return channel;
    }
    throw new HttpException('Channel with this name does not exist', HttpStatus.NOT_FOUND);
  }

  //
  async getOwnerByChannelId(id: number) {
    let channel = await this.channelRepository.findOne(id, { relations: ['owner'] });
    if (channel) {
      return channel.owner;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getMembersByChannelId(id: number) {
    let channel = await this.channelRepository.findOne(id, { relations: ['members'] });
    if (channel) {
      return channel.members;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAdminsByChannelId(id: number) {
    let channel = await this.channelRepository.findOne(id, { relations: ['admins'] });
    if (channel) {
      return channel.admins;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAllInfosByChannelId(id: number) {
    let channel = await this.channelRepository.findOne(id, { relations: ['members', 'owner', 'admins', 'banned', 'muted', 'historic', 'muteDates'] });
    if (channel) {
      await this.checkMuteTime(channel);
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async changePassword(channel_id: number, owner_id: number, password: PasswordDto) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if ((await this.isOwner(channel_id, owner_id))) {
      if (channel.password === "")
        channel.passwordSet = false;
      else {
        channel.passwordSet = true;
        channel.password = await bcrypt.hash(password.password, 10);
      }
      return (await this.channelRepository.save(channel));
    }
    throw new HttpException('Only the owner of a channel can change its password', HttpStatus.NOT_FOUND);
  }

  async isAMember(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if ((await channel.members.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async isAnAdmin(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if ((await channel.admins.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async isOwner(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (user_id == channel.owner.id)
      return true;
    return false;
  }

  async isBanned(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if ((await channel.banned.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async muteStillUpToDate(channel: Channel, user_id: number) {
    let indexUsers = channel.muted.findIndex(element => element.id === user_id);
    if (indexUsers === -1)
      return false;
    let indexDates = channel.muteDates.findIndex(element => element.userId === user_id);
    if (indexDates !== -1) {
      if (channel.muteDates[indexDates].silencedUntil > String(Date.now())) {
        return true;
      }
      else {
        await this.refreshMutedUsers(channel);
        return false;
      }
    }
    await this.refreshMutedUsers(channel);
    return false;
  }

  async isMuted(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    let user = await this.usersService.getById(user_id);
    if (channel.next_unmute_date && channel.next_unmute_date > String(Date.now())
      && ((await this.muteStillUpToDate(channel, user_id))))
      return true;
    return false;
  }


  //RIGHTS TO ADD OR REMOVE OTHER USERS IN A CHANNEL

  async canAddMemberInAPrivateChannel(channel_id: number, other_id: number, user_id: number) {
    if (await this.usersService.isSiteAdmin(user_id)
      || ((await this.usersService.isAFriend(other_id, user_id)))
      || ((await this.isAnAdmin(channel_id, user_id))
        && !((await this.usersService.isBlocked(other_id, user_id))
          || (await this.usersService.isBlocked(user_id, other_id))
          || (await this.isBanned(channel_id, other_id)))))
      return true;
    return false;
  }

  async canSendAPrivateMessage(other_id: number, user_id: number) {
    if ((await this.usersService.isSiteAdmin(user_id))
      || !(await this.usersService.isBlocked(other_id, user_id)))
      return true;
    return false;
  }

  async passwordOK(channel: Channel, password: string) {
    if (!channel.passwordSet)
      return true;
    const isPasswordMatching = await bcrypt.compare(
      password,
      channel.password
    );
    return isPasswordMatching;

  }

  async joinChannel(channel_id: number, user_id: number, password: string) {
    let channel = await this.getAllInfosByChannelId(channel_id);
    let newMember = await this.usersService.getAllInfosByUserId(user_id);
    if (channel.type === 1 /* public */ || (channel.type === 2 /* private */ && await this.passwordOK(channel, password))) {
      if (!(await this.isAMember(channel_id, user_id))) {
        channel.members.push(newMember);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User is already a member of this channel', HttpStatus.OK);
    }
    throw new HttpException('Wrong password' , HttpStatus.FORBIDDEN);
  }

  async addMember(channel_id: number, other_id: number, user_id: number) {
    let channel = await this.getAllInfosByChannelId(channel_id);
    let newMember = await this.usersService.getAllInfosByUserId(other_id);
    if (channel.type === 2 /* private */ && (await this.canAddMemberInAPrivateChannel(channel_id, other_id, user_id))) {
      if (!(await this.isAMember(channel_id, other_id))) {
        channel.members.push(newMember);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User is already a member of this channel', HttpStatus.OK);
    }
    throw new HttpException('No right to add this member in this channel', HttpStatus.FORBIDDEN);
  }

  async removeMember(channel_id: number, other_id: number, user_id: number) {
    if (other_id === user_id || (await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      if ((await this.isAMember(channel_id, other_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        let index = channel.members.findIndex(element => element.id === other_id);
        await channel.members.splice(index, 1);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async removeAdmin(channel_id: number, other_id: number, user_id: number) {
    if (other_id === user_id || (await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      let channel = await this.getAllInfosByChannelId(channel_id);
      let index = channel.admins.findIndex(element => element.id === other_id);
      await channel.admins.splice(index, 1);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async removeOwner(channel_id: number, other_id: number, user_id: number) {
    if (other_id === user_id || (await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      await this.removeAdmin(channel_id, other_id, user_id);
      await this.removeMember(channel_id, other_id, user_id);
      let channel = await this.getAllInfosByChannelId(channel_id);
      if (channel.admins && channel.admins[0])
        channel.owner = channel.admins[0];
      else if (channel.members && channel.members[0])
        channel.owner = channel.members[0];
      else
        return (await this.deleteChannel(channel_id, user_id));
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async removeFromChannel(channel_id: number, other_id: number, user_id: number) {
    if ((await this.isAMember(channel_id, other_id))) {
      if ((await this.isAnAdmin(channel_id, other_id))) {
        if ((await this.isOwner(channel_id, other_id))) {
          return (await this.removeOwner(channel_id, other_id, user_id));
        }
        await this.removeAdmin(channel_id, other_id, user_id);
      }
      return (await this.removeMember(channel_id, other_id, user_id));
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }


  //RIGHTS OVER OVER USERS IN A CHANNEL :

  async hasChannelRightsOverMember(channel_id: number, user_id: number, other_id: number) {
    if ((await this.isAMember(channel_id, user_id)) && user_id !== other_id) {
      if ((await this.usersService.hasSiteRightsOverOtherUser(user_id, other_id))
        || (!(await this.usersService.hasSiteRightsOverOtherUser(other_id, user_id))
          && ((await this.isOwner(channel_id, user_id))
            || ((await this.isAnAdmin(channel_id, user_id)) && !(await this.isAnAdmin(channel_id, other_id))))))
        return true;
    }
    return false;
  }

  async addAdmin(channel_id: number, other_id: number, user_id: number) {
    if ((await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      if ((await this.isAMember(channel_id, other_id))) {
        if (!(await this.isAnAdmin(channel_id, other_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id);
          let newAdmin = await this.usersService.getById(other_id);
          await channel.admins.push(newAdmin);
          await this.channelRepository.save(channel);
          return channel;
        }
        throw new HttpException('User is already an admin of this channel', HttpStatus.OK);
      }
      throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async revokeAdmin(channel_id: number, other_id: number, user_id: number) {
    if ((await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      if ((await this.isAnAdmin(channel_id, other_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        if (channel.admins.length > 1) {
          let index = channel.admins.findIndex(element => element.id === other_id);
          await channel.admins.splice(index, 1);
          await this.channelRepository.save(channel);
          return channel;
        }
        throw new HttpException('Revoking this admin would result in the absence of an admin for this channel', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('User with this id is not an admin of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async banAMember(channel_id: number, other_id: number, user_id: number) {
    if ((await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      await this.removeFromChannel(channel_id, other_id, user_id);
      let channel = await this.getAllInfosByChannelId(channel_id);
      let newBanned = await this.usersService.getById(other_id);
      await channel.banned.push(newBanned);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async unbanAMember(channel_id: number, other_id: number, user_id: number) {
    if ((await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      if ((await this.isBanned(channel_id, other_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        let index = channel.banned.findIndex(element => element.id === other_id);
        await channel.banned.splice(index, 1);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User with this id has not been banned', HttpStatus.OK);
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }

  async muteAMember(channel_id: number, other_id: number, time: bigint, user_id: number) {
    if ((await this.isAMember(channel_id, other_id))) {
      if ((await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
        if (!(await this.isMuted(channel_id, other_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id);
          let newMuted = await this.usersService.getById(other_id);
          await channel.muted.push(newMuted);
          let newMuteObj = await this.muteObjRepository.create({
            id: 0,
            userId: other_id,
            silencedUntil: String((Date.now()) + Number(time)),
            channel: channel
          })
          await this.muteObjRepository.save(newMuteObj);
          await channel.muteDates.push(newMuteObj);
          if (!channel.next_unmute_date || channel.next_unmute_date > newMuteObj.silencedUntil)
            channel.next_unmute_date = newMuteObj.silencedUntil;
          await this.channelRepository.save(channel);
          channel = await this.getAllInfosByChannelId(channel_id);
          return channel;
        }
        throw new HttpException('User with this id is already muted', HttpStatus.OK);
      }
      throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async unmuteChecksOK(channel_id: number, other_id: number) {
    let channel = await this.getAllInfosByChannelId(channel_id);
    let dateIndex = channel.muteDates.findIndex(muteObj => muteObj.userId === other_id);
    channel.muteDates.splice(dateIndex, 1);
    let userIndex = channel.muted.findIndex(user => user.id === other_id);
    channel.muted.splice(userIndex, 1);
    await this.channelRepository.save(channel);
    return await this.refreshMutedUsers(channel);
  }

  async unmuteAMember(channel_id: number, other_id: number, user_id: number) {
    if (user_id === -1 || (await this.hasChannelRightsOverMember(channel_id, user_id, other_id))) {
      if ((await this.isMuted(channel_id, other_id))) {
        return (await this.unmuteChecksOK(channel_id, other_id))
      }
      throw new HttpException('User with this id has not been muted', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Your rights in this channel are too low', HttpStatus.FORBIDDEN);
  }


  //CHANNEL CREATION

  async getPrivateMessageChannel(user_id: number, other_id: number): Promise<Channel> {
    const userChannels = await this.usersService.getChannelsByUserId(user_id);
    for (var channel of userChannels) {
      if (channel.type === 3) {
        for (var user of channel.members) {
          if (user.id === other_id)
            return channel;
        }
      }
    }
    return null;
  }

  async createChannel(channelData: CreateChannelDto, user_id: number) {
    if (channelData.type !== 1 && channelData.type !== 2 && channelData.type !== 3)
      throw new HttpException('What type of channel are you trying to create?! 1 for public channel, 2 for private channel, 3 for private message', HttpStatus.FORBIDDEN);
    if (channelData.type === 3) {
      if (!(channelData.otherUserIdForPrivateMessage))
        throw new HttpException('No member given for private message', HttpStatus.FORBIDDEN);
      if (!(await this.canSendAPrivateMessage(channelData.otherUserIdForPrivateMessage, user_id)))
        throw new HttpException('This user has blocked you', HttpStatus.FORBIDDEN);
      let channel = await this.getPrivateMessageChannel(user_id, channelData.otherUserIdForPrivateMessage);
      if (channel)
        return channel;
    }
    if (channelData.type !== 3 && channelData.otherUserIdForPrivateMessage)
      throw new HttpException('A private or public channel can only be created with one member (you) at the beginning', HttpStatus.FORBIDDEN);
    let channelOwner = await this.usersService.getById(user_id);
    let newChannel = await this.channelRepository.create({
      name: channelData.name,
      owner: channelOwner,
      type: channelData.type,
      password: channelData.password ? await bcrypt.hash(channelData.password, 10) : "", //Flavien
      members: [channelOwner],
      admins: [channelOwner],
      banned: [],
      muted: [],
    });
    if (newChannel. type !== 2 || newChannel.password === "")
      newChannel.passwordSet = false;
    else
      newChannel.passwordSet = true;
    if (newChannel.type === 3) {
      let newMember = await this.usersService.getById(channelData.otherUserIdForPrivateMessage);
      newChannel.members.push(newMember);
    }
    await this.channelRepository.save(newChannel);//add await ?
    newChannel = await this.getAllInfosByChannelId(newChannel.id);
    return (newChannel);
  }


  //CHANNEL DELETION

  async deleteChannel(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if ((await this.isOwner(channel_id, user_id)) || (await this.usersService.isSiteAdmin(user_id))) {
      await this.deleteMessages(channel);
      return (await this.channelRepository.delete(channel_id));
    }
    throw new HttpException('A channel can only be deleted by its owner or a website admin', HttpStatus.FORBIDDEN);
  }
}
