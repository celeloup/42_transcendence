import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import Message from './message.entity';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from './channel.entity';
import CreateChannelDto from './dto/createChannel.dto';
import UsersService from '../users/users.service';
import UserDto from './dto/User.dto';

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
    const newMessage = await this.messagesRepository.create({
      content,
      author,
      recipient
    });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getMessageByChannel(channel: Channel) {
    return this.messagesRepository.find({
      where: { recipient: channel },
      relations: ["author"]
    });
  }

  async getAllChannels() {
    const channels = await this.channelRepository.find();
    if (channels) {
      return channels;
    }
    throw new HttpException('No channel has been created yet', HttpStatus.NOT_FOUND);
  }

  async getChannelById(id: number) {
    const channel = await this.channelRepository.findOne(id);
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getOwnerByChannelId(id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['owner'] });
    if (channel) {
      return channel.owner;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getMembersByChannelId(id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['members'] });
    if (channel) {
      return channel.members;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAdminsByChannelId(id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['admins'] });
    if (channel) {
      return channel.admins;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getAllInfosByChannelId(id: number) {
    const channel = await this.channelRepository.findOne(id, { relations: ['members', 'owner', 'admins', 'banned', 'muted'] });
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async isAMember(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (channel) {
      let user = await this.usersService.getById(user_id);
      if (user) {
        if ((await channel.members.findIndex(element => element.id === user_id)) !== -1) {
          return true;
        }
        return false;
      }
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async isAnAdmin(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (channel) {
      let user = await this.usersService.getById(user_id);
      if (user) {
        if ((await channel.admins.findIndex(element => element.id === user_id)) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  async isOwner(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (channel) {
      if (user_id == channel.owner.id)
        return true;
    }
    return false;
  }

  async isBanned(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (channel && channel.banned) {
      let user = await this.usersService.getById(user_id);
      if (user) {
        if ((await channel.banned.findIndex(element => element.id === user_id)) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  async isMuted(channel_id: number, user_id: number) {
    const channel = await this.getAllInfosByChannelId(channel_id);
    if (channel) {
      let user = await this.usersService.getById(user_id);
      if (user) {
        if ((await channel.muted.findIndex(element => element.id === user_id)) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  async addMember(channel_id: number, member_id: number) {
    if (!(await this.isAMember(channel_id, member_id))) {
      if (!(await this.isBanned(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        let newMember = await this.usersService.getById(member_id);
        await channel.members.push(newMember);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('Banned users cannot be added to members', HttpStatus.FORBIDDEN)
    }
    throw new HttpException('User is already a member of this channel', HttpStatus.OK);
  }

  async deleteMember(channel_id: number, member_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if (!(await this.isAnAdmin(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        let index = channel.members.findIndex(element => element.id === member_id);
        await channel.members.splice(index, 1);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('This user is an admin', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async addAdmin(channel_id: number, member_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if (!(await this.isAnAdmin(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
        let newAdmin = await this.usersService.getById(member_id);
        await channel.admins.push(newAdmin);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User is already an admin of this channel', HttpStatus.OK);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async revokeAdmin(channel_id: number, member_id: number) {
    if ((await this.isAnAdmin(channel_id, member_id))) {
      if (!(await this.isOwner(channel_id, member_id))) {
        let channel = await this.getAllInfosByChannelId(channel_id);
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

  async banAMember(channel_id: number, member_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if (!(await this.isAnAdmin(channel_id, member_id))) {
        await this.deleteMember(channel_id, member_id);
        let channel = await this.getAllInfosByChannelId(channel_id);
        let newBanned = await this.usersService.getById(member_id);
        await channel.banned.push(newBanned);
        await this.channelRepository.save(channel);
        return channel;
      }
      throw new HttpException('User with this id is an admin of this channel', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async unbanAMember(channel_id: number, member_id: number) {
    if ((await this.isBanned(channel_id, member_id))) {
      let channel = await this.getAllInfosByChannelId(channel_id);
      let index = channel.banned.findIndex(element => element.id === member_id);
      await channel.banned.splice(index, 1);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('User with this id has not been banned', HttpStatus.NOT_FOUND);
  }

  async muteAMember(channel_id: number, member_id: number) {
    if ((await this.isAMember(channel_id, member_id))) {
      if (!(await this.isMuted(channel_id, member_id))) {
        if (!(await this.isAnAdmin(channel_id, member_id))) {
          let channel = await this.getAllInfosByChannelId(channel_id);
          let newMuted = await this.usersService.getById(member_id);
          await channel.muted.push(newMuted);
          await this.channelRepository.save(channel);
          return channel;
        }
        throw new HttpException('User with this id is an admin of this channel', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('User with this id is already muted', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('User with this id is not a member of this channel', HttpStatus.NOT_FOUND);
  }

  async unmuteAMember(channel_id: number, member_id: number) {
    if ((await this.isMuted(channel_id, member_id))) {
      let channel = await this.getAllInfosByChannelId(channel_id);
      let index = channel.muted.findIndex(element => element.id === member_id);
      await channel.muted.splice(index, 1);
      await this.channelRepository.save(channel);
      return channel;
    }
    throw new HttpException('User with this id has not been muted', HttpStatus.NOT_FOUND);
  }

  async createChannel(channelData: CreateChannelDto) {
    let channelOwner = await this.usersService.getById(channelData.owner_id);
    if (channelOwner) {
      let newChannel = await this.channelRepository.create({
        name: channelData.name,
        owner: channelOwner,
        members: [channelOwner],
        admins: [channelOwner],
      });
      await this.channelRepository.save(newChannel);
      return newChannel;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
