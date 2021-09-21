import Paddle from './paddle.class';
import Puck from './puck.class';

export default class Round {
  
  id_player1: number;
  id_player2: number;
  
  speed: number;
  goal: number;
  boost_available: boolean;

  score_player1: number;
  score_player2: number;
  
  paddle_player1: Paddle;
  paddle_player2: Paddle;
  puck: Puck;

}