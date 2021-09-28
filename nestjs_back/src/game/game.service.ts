import { Injectable, Logger } from '@nestjs/common';
import Round from './class/round.class';

@Injectable()
export default class GameService {

    private logger: Logger = new Logger("GameService");

    async startGame(param: Round, users: number[]) {
        await this.waitPlayer(param, users);
        this.logger.log("Start game");
    }

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

    //ajouter check pour etre sur qu'il est co dans la bonne room;
    async waitPlayer(param: Round, users: number[]) {
        this.logger.log(`Waiting for the player`);
        return new Promise(resolve => {
            let nbPlayer: number;
            let waitingPlayer = setInterval(() => {
                nbPlayer = 0;
                users.forEach(user => {
                    if (this.getPlayer(param, user) > 0) {
                        nbPlayer++; //le connecter sur la bonne room a cet endroit ?
                    }
                });
                if (nbPlayer === 2) {
                    clearInterval(waitingPlayer);
                    resolve(0);
                }
            }, 60);
        });
    }

}
