import { Injectable, Logger } from '@nestjs/common';
import Round from './class/round.class';

@Injectable()
export default class GameService {

    private logger: Logger = new Logger("GameService");

    getPlayer(param: Round, id: number) {
        if (id === param.id_player1) {
            this.logger.log("Found player 1");
            return 1;
        }
        if (id === param.id_player2) {
            this.logger.log("Found player 2");
            return 2;
        }
        return 0;
    }

    hasVictory(param: Round) {
        if (param.score_player1 === param.goal || param.score_player2 == param.goal) {
            param.victory = true;
        }
    }

	updateFrame(param: Round) {
    	param.puck.update(param);
		this.hasVictory(param);
  }
}
