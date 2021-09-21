import { Injectable } from '@nestjs/common';
import Match from '../matches/match.entity';
import Round from './class/round.class';
import Paddle from './class/paddle.class';
import Puck from './class/puck.class';

@Injectable()
export default class GameService {
  constructor(
    private readonly height: number = 360,
    private readonly width: number = 782,
    private readonly paddle_margin: number = 20,
  ) {
  }
  
  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }
  
  getPaddleMargin() {
    return this.paddle_margin;
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
    paddle_player1 : new Paddle (this.paddle_margin, this.height / 2),
    paddle_player2 : new Paddle (this.width - this.paddle_margin, this.height / 2),
    puck: new Puck (),
  };
	return param;
  }
}
