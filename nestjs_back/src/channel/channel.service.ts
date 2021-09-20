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

@Injectable()
export default class ChannelService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
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

  async getChannelById(id: number) {
    const channel = await this.channelRepository.findOne(id);
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
    const channel = await this.getChannelById(channel_id);
  }

  async createChannel(channelData: CreateChannelDto) {
    const owner = await this.usersService.getById(channelData.owner_id);
    if (owner) {
      const newChannel = await this.channelRepository.create({
        name: channelData.name,
        owner: owner,
        members: new Array,
        admin: new Array
      });

    //  newChannel.members.push(owner);
      await this.channelRepository.save(newChannel);
      // if (owner)
      //  await this.channelRepository.update(newChannel.id, {members:[owner]});
      // await this.channelRepository.save(newChannel);
      // await newChannel.members.push(owner);
      // await newChannel.admin.push(owner);
      return newChannel;

    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
