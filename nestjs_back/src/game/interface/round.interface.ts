import Element from './element.interface';

export default interface Round {
  
  id_player1: number;
  id_player2: number;
  
  speed: number;
  goal: number;
  boost_available: boolean;

  score_player1: number;
  score_player2: number;
  
  paddle_player1: Element;
  paddle_player2: Element;
  puck: Element;

}