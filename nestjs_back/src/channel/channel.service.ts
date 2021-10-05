import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import Message from './message.entity';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from './channel.entity';
import CreateChannelDto from './dto/createChannel.dto';
import UsersService from '../users/users.service';
import NewPasswordDto from './dto/newPassword.dto';

@Injectable()
export default class ChannelService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {
  }
  async saveMessage(content: string, author: User, recipient: Channel) {
    await this.getChannelById(recipient.id, author.id);//to check if channel exists
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

  async getMessagesByChannelId(channel_id: number, userId: number) {
    const channel = await this.channelRepository.findOne({ id: channel_id });
    if ((await this.isAMember(channel_id, userId) || (await this.usersService.isSiteAdmin(userId)))) {
      return await this.getMessageByChannel(channel);
    }
    throw new HttpException('Only members and site admins can see messages of a channel', HttpStatus.FORBIDDEN);
  }

  //TEMPORARY DEBUG PURPOSE
  async getAllMessages() {
    return await this.messagesRepository.find();
  }

  //TEMPORARY DEBUG PURPOSE
  async getAllChannels() {
    const channels = await this.channelRepository.find({ relations: ["historic"] });
    if (channels) {
      return channels;
    }
    throw new HttpException('No channel has been created yet', HttpStatus.NOT_FOUND);
  }

  async getChannelById(id: number, user_id: number) {
    const channel = await this.channelRepository.findOne(id);
    if (channel) {
      if (this.hasAccess(id, user_id)) {
        return channel;
      }
      throw new HttpException('User must be channel member or site admin to get these informations', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getOwnerByChannelId(id: number, user_id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['owner'] });
    if (channel) {
      if (this.hasAccess(id, user_id)) {
        return channel.owner;
      }
      throw new HttpException('User must be channel member or site admin to get these informations', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getMembersByChannelId(id: number, user_id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['members'] });
    if (channel) {
      if (this.hasAccess(id, user_id)) {
        return channel.members;
      }
      throw new HttpException('User must be channel member or site admin to get these informations', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAdminsByChannelId(id: number, user_id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['admins'] });
    if (channel) {
      if (this.hasAccess(id, user_id)) {
        return channel.admins;
      }
      throw new HttpException('User must be channel member or site admin to get these informations', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAllInfosByChannelId(id: number, user_id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['members', 'owner', 'admins', 'banned', 'muted', 'historic'] });
    if (channel) {
      if (this.hasAccess(id, user_id)) {
        return channel;
      }
      throw new HttpException('User must be channel member or site admin to get these informations', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async changePassword(channel_id: number, user_id: number, password: NewPasswordDto) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if ((await this.isOwner(channel_id, user_id))) {
      return (await this.channelRepository.update(channel_id, password));
    }
    throw new HttpException('Only the owner of a channel can change its password', HttpStatus.NOT_FOUND);
  }

  async hasAccess(channel_id: number, user_id: number) {
    if ((await this.isAMember(channel_id, user_id)) || (await this.usersService.isSiteAdmin(user_id)))
      return true;
    return false;
  }

  async isAMember(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if ((await channel.members.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async isAnAdmin(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if ((await channel.admins.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async isOwner(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if (user_id == channel.owner.id)
      return true;
    return false;
  }

  async isBanned(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if ((await channel.banned.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async isMuted(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    let user = await this.usersService.getById(user_id);
    if ((await channel.muted.findIndex(element => element.id === user_id)) !== -1)
      return true;
    return false;
  }

  async addMember(channel_id: number, member_id: number, user_id: number) {
    if (member_id === user_id || (await this.usersService.isAFriend(member_id, user_id)) || (await this.isAnAdmin(channel_id, user_id))) {
      if (!(await this.isAMember(channel_id, member_id))) {
        if (!(await this.isBanned(channel_id, member_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id, user_id);
          if (channel.type !== 3) {
            let newMember = await this.usersService.getAllInfosByUserId(member_id);
            channel.members.push(newMember);
            await this.channelRepository.save(channel);
            return channel;
          }
          throw new HttpException('A private chat is only between two users', HttpStatus.FORBIDDEN);
        }
        throw new HttpException('Banned users cannot be added to members', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('User is already a member of this channel', HttpStatus.OK);
    }
    throw new HttpException('To add a member, you need to be their friend OR be an admin OR be this member', HttpStatus.FORBIDDEN);
  }

  async removeMember(channel_id: number, member_id: number, user_id: number) {
    if (member_id === user_id || (await this.isAnAdmin(channel_id, user_id))) {
      if ((await this.isAMember(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id, user_id);
        let index = channel.members.findIndex(element => element.id === member_id);
        await channel.members.splice(index, 1);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('A member can only be removed by themselves or an admin', HttpStatus.FORBIDDEN);
  }

  async removeAdmin(channel_id: number, member_id: number, user_id: number) {
    if (member_id === user_id || (await this.isOwner(channel_id, user_id))) {
      let channel = await this.getAllInfosByChannelId(channel_id, user_id);
      let index = channel.admins.findIndex(element => element.id === member_id);
      await channel.admins.splice(index, 1);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('An admin can only be revoked by themselves or the owner', HttpStatus.FORBIDDEN);
  }

  async removeOwner(channel_id: number, owner_id: number, user_id: number) {
    if (owner_id === user_id) {
      await this.removeAdmin(channel_id, owner_id, user_id);
      await this.removeMember(channel_id, owner_id, user_id);
      let channel = await this.getAllInfosByChannelId(channel_id, user_id);
      if (channel.members && channel.members[0])
        channel.owner = channel.members[0];
      else
        return (await this.deleteChannel(channel_id, owner_id));
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('The owner can only be revoked by themselves', HttpStatus.FORBIDDEN);
  }

  async removeFromChannel(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if ((await this.isAnAdmin(channel_id, member_id))) {
        if ((await this.isOwner(channel_id, member_id))) {
          return (await this.removeOwner(channel_id, member_id, user_id));
        }
        await this.removeAdmin(channel_id, member_id, user_id);
      }
      return (await this.removeMember(channel_id, member_id, user_id));
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async addAdmin(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isOwner(channel_id, user_id))) {
      if ((await this.isAMember(channel_id, member_id))) {
        if (!(await this.isAnAdmin(channel_id, member_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id, user_id);
          let newAdmin = await this.usersService.getById(member_id);
          await channel.admins.push(newAdmin);
          await this.channelRepository.save(channel);
          return channel;
        }
        throw new HttpException('User is already an admin of this channel', HttpStatus.OK);
      }
      throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Only the owner of a channel can add new admins', HttpStatus.FORBIDDEN);
  }

  async revokeAdmin(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isOwner(channel_id, user_id))) {
      if ((await this.isAnAdmin(channel_id, member_id))) {
        if (!(await this.isOwner(channel_id, member_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id, user_id);
          if (channel.admins.length > 1) {
            let index = channel.admins.findIndex(element => element.id === member_id);
            await channel.admins.splice(index, 1);
            await this.channelRepository.save(channel);
            return channel;
          }
          throw new HttpException('Revoking this admin would result in the absence of an admin for this channel', HttpStatus.FORBIDDEN);
        }
        throw new HttpException('User with this id is the owner of this channel', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('User with this id is not an admin of this channel', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Only the owner of a channel can revoke an admin', HttpStatus.FORBIDDEN);
  }

  async banAMember(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isAnAdmin(channel_id, user_id))) {
      if (!(await this.isAnAdmin(channel_id, member_id)) || ((await this.isAnAdmin(channel_id, member_id)) && (await this.isOwner(channel_id, user_id)))) {
        await this.removeFromChannel(channel_id, member_id, user_id);
        let channel = await this.getAllInfosByChannelId(channel_id, user_id);
        let newBanned = await this.usersService.getById(member_id);
        await channel.banned.push(newBanned);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('Only the owner can ban admins', HttpStatus.FORBIDDEN)
    }
    throw new HttpException('Only admins can ban members', HttpStatus.FORBIDDEN);
  }

  async unbanAMember(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isAnAdmin(channel_id, user_id))) {
      if ((await this.isBanned(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id, user_id);
        let index = channel.banned.findIndex(element => element.id === member_id);
        await channel.banned.splice(index, 1);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User with this id has not been banned', HttpStatus.OK);
    }
    throw new HttpException('Only admins can unban members', HttpStatus.FORBIDDEN);
  }

  async muteAMember(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if (!(await this.isMuted(channel_id, member_id))) {
        if (!(await this.isAnAdmin(channel_id, member_id)) || (await this)) {
          let channel = await this.getAllInfosByChannelId(channel_id, user_id);
          let newMuted = await this.usersService.getById(member_id);
          await channel.muted.push(newMuted);
          await this.channelRepository.save(channel);
          return channel;
        }
        throw new HttpException('User with this id is an admin of this channel', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('User with this id is already muted', HttpStatus.OK);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async unmuteAMember(channel_id: number, member_id: number, user_id: number) {
    if ((await this.isMuted(channel_id, member_id))) {
      let channel = await this.getAllInfosByChannelId(channel_id, user_id);
      let index = channel.muted.findIndex(element => element.id === member_id);
      await channel.muted.splice(index, 1);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('User with this id has not been muted', HttpStatus.NOT_FOUND);
  }

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
    if (channelData.type === 3) {
      if (channelData.members.length !== 1)
        throw new HttpException('A private chat is only between two members', HttpStatus.FORBIDDEN);
      let channel = await this.getPrivateMessageChannel(user_id, channelData.members[0]);
      if (channel)
        return channel;
    }
    let channelOwner = await this.usersService.getById(user_id);
    let newChannel = await this.channelRepository.create({
      name: channelData.name,
      owner: channelOwner,
      type: channelData.type,
      password: channelData.password,
      members: [channelOwner],
      admins: [channelOwner],
      banned: [],
      muted: []
    });
    for (var member_id of channelData.members) {
      if ((await this.usersService.isBlocked(member_id, user_id)))
        throw new HttpException('Owner of the channel is blocked by one of the members', HttpStatus.FORBIDDEN);
      else if (member_id !== user_id) {
        let newMember = await this.usersService.getById(member_id);
        if (newChannel.members.indexOf(newMember) === -1)
          newChannel.members.push(newMember);
      }
    }
    await this.channelRepository.save(newChannel);
    return newChannel;
  }

  async deleteChannel(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id, user_id);
    if ((await this.isOwner(channel_id, user_id)) || (await this.usersService.isSiteAdmin(user_id))) {
      await this.deleteMessages(channel);
      return (await this.channelRepository.delete(channel_id));
    }
    throw new HttpException('A channel can only be deleted by its owner or a website admin', HttpStatus.FORBIDDEN);
  }
}
