import GameService from '../game.service';
import Paddle from './paddle.class';
import Puck from './puck.class';

export default class Round {
  private readonly game: GameService;
  
  id_player1: number;
  id_player2: number;
  
  speed: number;
  goal: number;
  boost_available: boolean;

  score_player1: number = 0;
  score_player2: number = 0;
  
  paddle_player1: Paddle;
  paddle_player2: Paddle;
  puck: Puck;

  constructor(id1: number, id2: number, speed: number, goal: number, boost: boolean) {
    this.id_player1 = id1;
    this.id_player2 = id2;
    this.speed = speed;
    this.goal = goal;
    this.boost_available = boost;

    this.paddle_player1 = new Paddle (this.game.paddle_margin, this.game.height / 2),
    this.paddle_player2 = new Paddle (this.game.width - this.game.paddle_margin, this.game.height / 2),
    this.puck = new Puck;
  }
}