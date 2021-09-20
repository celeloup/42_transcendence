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

  initGame(match: Match) {
    var param: Round = {

    id_player1 : match.user1_id,
    id_player2 : match.user2_id,
    speed : 10,
    goal : 10,
    boost_available : false,
    score_player1 : 0,
    score_player2 : 0,
    paddle_player1 : {x : 0, y : this.height / 2 },
    paddle_player2 : {x : 0, y : this.height / 2 },
    puck: {x : this.width / 2, y : this.height / 2 },
  };
	return param;
  }
}

