import { Injectable, Logger } from '@nestjs/common';
import Round from './class/round.class';
import { Server, Socket } from 'socket.io';
import User from 'src/users/user.entity';
import AuthenticationService from 'src/authentication/authentication.service';

@Injectable()
export default class GameService {

    private readonly authenticationService: AuthenticationService;
    private logger: Logger = new Logger("GameService");

    async startGame(server: Server, param: Round, users: Map<number, Socket>, inGame: Array<number>) {
        await this.waitPlayer(server, param, users);
        this.logger.log(`Start game ${param.id_game}`);

        //on ajoute les joueurs a la liste des users en cours de jeu;
        inGame.push(param.id_player1);
        inGame.push(param.id_player2);
        await new Promise(f => setTimeout(f, 1000));

        while (!param.victory) {
            //update every 60 fps
            await new Promise(f => setTimeout(f, 16)); //timer
            this.updateFrame(param);
            server.in(param.id_game).emit('new_frame', param);
        }

        if (param.victory) {
            server.emit('finish_game', param);
        }
        else { 
            server.emit('finish_game', param);
        }
        //est-ce qu'on garde cette option ?
        // if (nbPlayer < 2) {
        //     server.emit('interrupted_game');
        // }
    }

    getPlayer(param: Round, id: number) {
        if (id === param.id_player1) {
            this.logger.log(`Found player 1 game ${param.id_game}`);
            return 1;
        }
        if (id === param.id_player2) {
            this.logger.log(`Found player 2 game ${param.id_game}`);
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

    async waitPlayer(server: Server, param: Round, users: Map<number, Socket>) {
        this.logger.log(`Waiting for the player game ${param.id_game}`);
        return new Promise(resolve => {
            let nbPlayer: number;
            let users_id = Array.from(users.keys())
            let waitingPlayer = setInterval(() => {
                nbPlayer = 0;
                users_id.forEach(user => {
                    if (this.getPlayer(param, user) > 0) {
                        nbPlayer++;
                        let client = users.get(user);
                        server.in(client.id).socketsJoin(param.id_game);
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
