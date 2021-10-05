import { Injectable, Logger } from '@nestjs/common';
import Round from './class/round.class';
import { Server, Socket } from 'socket.io';
import User from 'src/users/user.entity';
import AuthenticationService from 'src/authentication/authentication.service';

@Injectable()
export default class GameService {

    private readonly authenticationService: AuthenticationService;
    private logger: Logger = new Logger("GameService");

    checkDisconnection(game: string, player1: Socket, player2: Socket, usersRoom: Map<Socket, string> ) {
        if (usersRoom.get(player1) != game) {
            if (usersRoom.get(player2) != game) {
                return 3;
            }
            return 1;
        }
        if (usersRoom.get(player2) != game) {
            return 2;
        }
        return 0;
    }

    async startGame(server: Server, param: Round, users: Map<number, Socket>, usersRoom: Map<Socket, string>, inGame: Array<number>) {
        let idGame = param.id_game;
        let socketPlayer1 = users.get(param.id_player1);
        let socketPlayer2 = users.get(param.id_player2);

        //on attendant que tous les players soient dans la room, si plus aucun playeur, on annule la partie;
        if (await this.waitPlayer(server, idGame, socketPlayer1, socketPlayer2, usersRoom) == 1) {
            return 1;
        }
        this.logger.log(`Start game ${param.id_game}`);

        //on ajoute les joueurs a la liste des users en cours de jeu et on attend laisse une pause avant de lancer la partie;
        param.pending = false;
        inGame.push(param.id_player1);
        inGame.push(param.id_player2);
        await new Promise(f => setTimeout(f, 1000));

        let missingPlayer = 0;
        while (param.victory == - 1 && !missingPlayer) {
            missingPlayer = this.checkDisconnection(idGame, socketPlayer1, socketPlayer2, usersRoom);
            this.updateFrame(param);
            server.in(idGame).emit('new_frame', param);
            //update every 60 fps
            await new Promise(f => setTimeout(f, 16)); //timer
        }
 
        if (param.victory != -1) {
            server.emit('finish_game', param);
            return 0;
        }
        if (missingPlayer == 1) {
            param.victory = param.id_player2;
        } 
        if (missingPlayer == 2) {
            param.victory = param.id_player1;
        } 
        server.emit('interrupted_game', param);
            return 0;
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
        if (param.score_player1 === param.goal) {
            param.victory = param.id_player1;
            return ;
        }
        if (param.score_player2 === param.goal) {
            param.victory = param.id_player2;
            return ;
        }
    }

    updateFrame(param: Round) {
        param.puck.update(param);
        this.hasVictory(param);
    }

    async waitPlayer(server: Server, idGame: string, player1: Socket, player2: Socket, usersRoom: Map<Socket, string>) {
        this.logger.log(`Waiting for the player game ${idGame}`);
        return new Promise(resolve => {
            let waitingPlayer = setInterval(() => {
                let missingPlayers = this.checkDisconnection(idGame, player1, player2, usersRoom);
                if (missingPlayers == 0) {
                    clearInterval(waitingPlayer);
                    resolve(0);
                }
                if (missingPlayers == 3) {
                    clearInterval(waitingPlayer);
                    resolve(1);
                }

            }, 60);
        });
    }
}
