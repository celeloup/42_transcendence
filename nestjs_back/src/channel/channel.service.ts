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

	//si j'ai bien compris : relations renvoi tout l'objet (utile qd recipient ne sera plus une simple string)
    async getMessageByChannel(channel: string) {
      return this.messagesRepository.find({
        where : {recipient: channel }
      });
    }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      return null
    }
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
