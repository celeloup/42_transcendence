import { Injectable } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
 
@Injectable()
export default class GameService {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {
  }
 
  async getUserFromSocket(socket: Socket) {
    let authenticationToken: string

    const cookie = socket.handshake.headers?.cookie;
    const bearer = socket.handshake.headers?.authorization;
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