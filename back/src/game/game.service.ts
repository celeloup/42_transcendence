import { Injectable, Logger } from '@nestjs/common';
import Round from './class/round.class';
import { Server, Socket } from 'socket.io';
import Match from 'src/matches/match.entity';
import MatchService from '../matches/matches.service';

@Injectable()
export default class GameService {

    constructor(
        private readonly matchService: MatchService
    ) { }
    private logger: Logger = new Logger("GameService");

    private usersRoom: Map<Socket, string> = new Map();
    private currentGames: Map<number, [Round, Match]> = new Map();
    private playingUsers: number[] = [];

    getCurrentGames() {
        return this.currentGames;
    }

    setCurrentGames(id: number, paramR: Round, paramM: Match) {
        this.currentGames.set(id, [paramR, paramM]);
    }

    getPlayingUsers() {
        return this.playingUsers;
    }

    checkDisconnection(game: string, player1: Socket, player2: Socket, usersRoom: Map<Socket, string>) {
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

    deleteMatchObjet(matchId: number) {
        this.matchService.deleteMatch(matchId);
    }

    deletePlayingUser(user_id: number) { 
        this.playingUsers = this.playingUsers.filter(function(user){ 
            return user != user_id; 
        });
    }

    async launchGame(server: Server, match: Match, usersSocket: Map<number, Socket>) {

        //on initialise la game avec les parametres de jeu envoye par le front et on l'ajoute aux matchs en cours
        match = await this.matchService.updateMatch(match.id, match);
        let round = new Round(match.id.toString(), match.user1_id, match.user2_id, match.speed, match.goal, match.boost_available, match.map);
		
        this.currentGames.set(match.id, [round, match]);
		server.emit('update_current_games', Array.from(this.currentGames.values()));
        
        this.playingUsers.push(match.user1_id);
        this.playingUsers.push(match.user2_id);
        server.emit('update_online_users', Array.from(usersSocket.keys()), this.playingUsers);

        //on lance le jeu, retourne 1 si la partie a ete annule
        if (await this.startGame(server, round, usersSocket, this.playingUsers, match)) {
            this.deleteMatchObjet(match.id);
            this.currentGames.delete(match.id);
            server.emit('update_current_games', Array.from(this.currentGames.values()));
            
            this.deletePlayingUser(round.id_player1);
            this.deletePlayingUser(round.id_player2);
            server.emit('update_online_users', Array.from(usersSocket.keys()), this.playingUsers);
			
            return;
        }

        //on met a jour l'objet match
        match.score_user1 = round.score_player1;
        match.score_user2 = round.score_player2;
        match.winner = round.victory;

        //on save le game et on retire les infos "en cours";
        await this.matchService.updateMatch(match.id, match);

        this.deletePlayingUser(round.id_player1);
        this.deletePlayingUser(round.id_player2);
        server.emit('update_online_users', Array.from(usersSocket.keys()), this.playingUsers);
        
        this.currentGames.delete(match.id);
		server.emit('update_current_games', Array.from(this.currentGames.values()));
    }

    async startGame(server: Server, param: Round, users: Map<number, Socket>, inGame: Array<number>, match: Match) {
        let idGame = param.id_game;
        let socketPlayer1 = users.get(param.id_player1);
        let socketPlayer2 = users.get(param.id_player2);

        //on verifie que les joueurs sont encore dans la room avant de lancer
        if (this.checkDisconnection(idGame, socketPlayer1, socketPlayer2, this.usersRoom) > 0) {
            server.in(idGame).emit('cancel_game', match);
            return 1;
        }
        server.in(idGame).emit('game_starting', match);

        this.logger.log(`Start game ${param.id_game} in 5 seconds`);
        await new Promise(f => setTimeout(f, 5000));
        param.pending = false;

        let missingPlayer = 0;
        while (param.victory == - 1 && !missingPlayer) {
            missingPlayer = this.checkDisconnection(idGame, socketPlayer1, socketPlayer2, this.usersRoom);
            this.updateFrame(param);
            server.in(idGame).emit('new_frame', param);
            //update every 60 fps
            await new Promise(f => setTimeout(f, 16)); //timer
        }

        if (param.victory != -1) {
            server.in(idGame).emit('finish_game', param);
            return 0;
        }
        if (missingPlayer == 1) {
            param.victory = param.id_player2;
        }
        if (missingPlayer == 2) {
            param.victory = param.id_player1;
        }
        server.in(idGame).emit('interrupted_game', param);
        return 0;
    }

    getPlayer(param: Round, id: number) {
        if (id === param.id_player1) {
            // this.logger.log(`Found player 1 game ${param.id_game}`);
            return 1;
        }
        if (id === param.id_player2) {
            // this.logger.log(`Found player 2 game ${param.id_game}`);
            return 2;
        }
        return 0;
    }

    hasVictory(param: Round) {      
            if (param.score_player1 === param.goal) {
                param.victory = param.id_player1;
                return;
            }
            if (param.score_player2 === param.goal) {
                param.victory = param.id_player2;
                return;
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

    joinRoom(server: Server, room: string, client: Socket) {
        let actual_room = this.usersRoom.get(client);
        if (actual_room) {
            client.leave(actual_room);
        }
        server.in(client.id).socketsJoin(room);
        this.usersRoom.set(client, room);
        this.logger.log(`Room ${room} joined`);
    }

    leaveRoom(room: string, client: Socket, leaveWS: boolean = true) {
        if (leaveWS) {
            client.leave(room.toString());
            this.logger.log(`Room ${room} left`);
        }
        this.usersRoom.delete(client);
    }

}
