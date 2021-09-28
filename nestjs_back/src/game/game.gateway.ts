import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Match from '../matches/match.entity';
import Round from './class/round.class';
import Paddle from './class/paddle.class';
import GameService from "./game.service";
import AuthenticationService from '../authentication/authentication.service';


@WebSocketGateway({ serveClient: false, namespace: '/game' })
export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("GameGateway");

  private connectedUsers: Map<number, Socket> = new Map();
  private currentGames: Map<number, Round> = new Map();
  // private param: Round;

  //pour tester avec des users non 42
  private i: number = 0;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly gameService: GameService,
  ) { }

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) 
  {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.set(user.id, client);
      this.logger.log(`Connection : ${user.name}`);
    }
    else {
      this.connectedUsers.set(this.i, client);
      this.logger.log(`Connection : invite ${this.i}`);
      this.i++;
    }
    this.logger.log(args);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.delete(user.id);
      this.logger.log(`Deconnection : ${user.name}`);
    }
    else {
      for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          this.connectedUsers.delete(key);
          this.logger.log(`Deconnection : invite ${key}`);
          break;
        }
      }
    }
  }

  @SubscribeMessage('join_game')
  async joinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
      this.server.in(client.id).socketsJoin(room);
      this.logger.log(`Room ${room} joined`);
  }

  @SubscribeMessage('leave_game')
  async leaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
      client.leave(room);    
      this.logger.log(`Room ${room} left`);
  }

  
  //est-ce qu'on revient ici si le jeux a ete interrompu ?
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
    @ConnectedSocket() client: Socket,
  ) {
    //on initialise la game avec les parametres de jeu envoye par le front
    let round = new Round(match.id.toString(), match.user1_id, match.user2_id, 10, 10, false);
    this.currentGames.set(match.id, round);

    this.gameService.startGame(round, Array.from(this.connectedUsers.keys()));
    this.i = 0;

    // await this.waitPlayer();
    // this.logger.log("Start game");

    // //temporiser le depart du jeu depuis le back ou le front ?
    // await new Promise(f => setTimeout(f, 1000));

    // while (this.nbPlayer == 2 && !this.param.victory) {
    //   //update every 60 fps
    //   await new Promise(f => setTimeout(f, 16)); //timer
    //   this.gameService.updateFrame(this.param);
    //   this.server.in(this.param.id_game).emit('new_frame', this.param);
    // }

    // if (this.param.victory)
    //   this.server.emit('finish_game', this.param);
    // if (this.nbPlayer < 2) {
    //   this.server.emit('interrupted_game');
    // }
  }

  @SubscribeMessage('paddle_movement')
  async setNewPosition(
    @MessageBody() data: {id_game: number, y: number},
    @ConnectedSocket() client: Socket,
  ) {
    let player: number;

    this.logger.log('Change paddle position');

    //on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user)
      player = this.gameService.getPlayer(this.currentGames.get(data.id_game), user.id);
    else {
      for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          player = this.gameService.getPlayer(this.currentGames.get(data.id_game), key);
          break;
        }
      }
    }

    if (player == 1) {
      this.currentGames.get(data.id_game).paddle_player1.y = data.y;
    }
    else if (player == 2) {
      this.currentGames.get(data.id_game).paddle_player2.y = data.y;
    }
  }
}
