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
  private param: Round;
  private nbPlayer: number = 0;

  //pour tester avec des users non 42
  private i: number = 0;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly gameService: GameService,
  ) { }

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, id_game: number[]) 
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
    this.server.in(client.id).socketsJoin(id_game.toString()); //seulement si c'est pas fait dans le front
  }

  async handleDisconnect(client: Socket) {
    // this.server.in(client.id).socketsLeave(id_game);
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.delete(user.id);
      this.logger.log(`Deconnection : ${user.name}`);
      if (this.nbPlayer > 0 && this.gameService.getPlayer(this.param, user.id))
        this.nbPlayer--;
    }
    else {
      for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          this.connectedUsers.delete(key);
          this.logger.log(`Deconnection : invite ${key}`);
          if (this.nbPlayer > 0 && this.gameService.getPlayer(this.param, key))
            this.nbPlayer--;
          break;
        }
      }
    }
  }

  async waitPlayer() {
    this.logger.log(`Waiting for the player`);
    return new Promise(resolve => {
      let waitingPlayer = setInterval(() => {
        this.nbPlayer = 0;
        for (let [key, value] of this.connectedUsers.entries()) {
          if (this.gameService.getPlayer(this.param, key) > 0)
            this.nbPlayer++;
        }
        if (this.nbPlayer === 2) {
          clearInterval(waitingPlayer);
          resolve(0);
        }
      }, 60);
    });
  }

  //est-ce qu'on revient ici si le jeux a ete interrompu ?
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
    @ConnectedSocket() client: Socket,
  ) {
    //on initialise la game avec les parametres de jeu envoye par le front
    this.param = new Round(match.id.toString(), match.user1_id, match.user2_id, 10, 10, false);
    await this.waitPlayer();
    this.logger.log("Start game");

    //temporiser le depart du jeu depuis le back ou le front ?
    await new Promise(f => setTimeout(f, 1000));

    while (this.nbPlayer == 2 && !this.param.victory) {
      //update every 60 fps
      await new Promise(f => setTimeout(f, 16)); //timer
      this.gameService.updateFrame(this.param);
      // this.server.emit('new_frame', this.param);
      this.server.to(this.param.id_game).emit('new_frame', this.param);
    }

    if (this.param.victory)
      this.server.emit('finish_game', this.param);
    if (this.nbPlayer < 2) {
      this.server.emit('interrupted_game');
    }
    this.i = 0;
  }

  @SubscribeMessage('paddle_movement')
  async setNewPosition(
    @MessageBody() y: number,
    @ConnectedSocket() client: Socket,
  ) {
    let player: number;

    this.logger.log('Change paddle position');

    //on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user)
      player = this.gameService.getPlayer(this.param, user.id);
    else {
      for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          player = this.gameService.getPlayer(this.param, key);
          break;
        }
      }
    }

    if (player == 1) {
      this.param.paddle_player1.y = y;
    }
    else if (player == 2) {
      this.param.paddle_player2.y = y;
    }
  }

  @SubscribeMessage('reset_counter')
  async reset() { this.i = 0; }
}
