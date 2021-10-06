import GameService from '../game.service';
import {height, width, paddle_margin} from '../game.settings'
import Paddle from './paddle.class';
import Puck from './puck.class';

export default class Round {
  id_game: string;
  pending: boolean = true;

  id_player1: number;
  id_player2: number;

  speed: number;
  goal: number;
  boost_available: boolean;

  score_player1: number = 0;
  score_player2: number = 0;
  victory: number = -1;

  paddle_player1: Paddle;
  paddle_player2: Paddle;
  puck: Puck;

  constructor(id: string, id1: number, id2: number, speed: number, goal: number, boost: boolean) {
    this.id_game = id;
    this.id_player1 = id1;
    this.id_player2 = id2;
    this.speed = speed;
    this.goal = goal;
    this.boost_available = boost;

    this.paddle_player1 = new Paddle (true),
    this.paddle_player2 = new Paddle (false),
    this.puck = new Puck;
  }
}
