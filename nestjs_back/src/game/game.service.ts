import { Injectable } from '@nestjs/common';
import AuthenticationService from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import Match from '../matches/match.entity';
import Round from './interface/round.interface';
import Element from './interface/element.interface';

@Injectable()
export default class GameService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly height: 360,
    private readonly width: 782,
    private readonly paddle_margin: 20,
  ) {
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
    paddle_player1 : {x : this.paddle_margin, y : this.height / 2 },
    paddle_player2 : {x : this.width - this.paddle_margin, y : this.height / 2 },
    puck: {x : this.width / 2, y : this.height / 2 },
  };
	return param;
  }

  gameLoop(param: Round) {
    while (1) {
      if (this.checkWinner(param))
        return param;

    }
  }

  checkWinner(param: Round) {
    return false;
  }
}
