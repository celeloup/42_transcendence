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
}
