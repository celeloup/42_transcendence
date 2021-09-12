import { Injectable } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import Message from './message.entity';
import User from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

 
@Injectable()
export default class ChannelService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {
  }
    async saveMessage(content: string, author: User, recipient: string) {
      const newMessage = await this.messagesRepository.create({
        content,
        author,
        recipient
      });
      await this.messagesRepository.save(newMessage);
      return newMessage;
    }

    async getMessageByChannel(channel: string) {
      return this.messagesRepository.find({
        where : {recipient: channel },
        relations: ["author"]
      });
    }

  async getUserFromSocket(socket: Socket) {
    let authenticationToken: string;
    const cookie = socket.handshake.headers.cookie;
    const bearer = socket.handshake.headers.authorization;
    if (cookie) {
      authenticationToken = parse(cookie).Authentication;
    } else if (bearer) {
      authenticationToken = bearer.split(" ")[1];
    } else {
      return null;
    }
    const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
