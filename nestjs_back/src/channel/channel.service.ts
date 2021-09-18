import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import Message from './message.entity';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from './channel.entity';
import UpdateChannelDto from './dto/updateChannel.dto';
import CreateChannelDto from './dto/createChannel.dto';
import UsersService from '../users/users.service';
import { ArrayContains } from 'class-validator';

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
    const channel = await this.channelRepository.findOne(id, { relations: ['members', 'owner', 'admin'] });
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  /*   async updateChannel(id: number, channelData: UpdateChannelDto) {
      await this.channelsRepository.update(id, channelData);
      const updatedChannel = await this.getChannelById(id);
      if (updatedChannel) {
        if (updatedChannel.score_user1 === 10 || updatedChannel.score_user2 === 10)
          return await this.weHaveAWinner(updatedChannel);
        else
          return updatedChannel;
      }
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    } */

  async addAMember(channel_id: number, member_id: number) {
    let channel = await this.getChannelById(channel_id);
    let newMember = await this.usersService.getById(member_id);
    await channel.members.fill(newMember, 0, 0);//  push(newMember);
    await this.channelRepository.save(channel);
  return channel;
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
