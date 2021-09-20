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
import Round from './interface/round.interface';
import Element from './interface/element.interface';
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
  private victory: boolean = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly gameService: GameService,
  ) {}

  //a deplacer dans service ?
  getPlayer(id: number){
    if (id == this.param.id_player1)
      return 1;
    if (id == this.param.id_player1)
      return 2;
    return 0;
  }

  hasVictory() {  
    if (this.param.score_player1 == this.param.goal || this.param.score_player2 == this.param.goal)
      this.victory == true;
  }

  setNewPosition(player :number, data :Element) {
    if (player == 0)
      return false;
    if (player == 1) {
      this.param.paddle_player1.x = data.x;
      this.param.paddle_player1.y = data.y;
    }
    else {
      this.param.paddle_player2.x = data.x;
      this.param.paddle_player2.y = data.y;
    }
    return true;
  }

  getNewFrame() {
    //ici on fait les nouveaux calculs
    //verifier la victoire seulement lorsqu'il y a un changement de points
    this.hasVictory();
  }

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.set(user.id, client);
      if (this.getPlayer(user.id))
        this.nbPlayer++;
    } else {
      this.connectedUsers.set(Math.random(), client);
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authenticationService.getUserFromSocket(client);
    this.connectedUsers.delete(user.id);
    if (this.getPlayer(user.id))
      this.nbPlayer--;
  }

  //est-ce qu'on revient ici si le jeux a ete interrompu ?
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
    @ConnectedSocket() client: Socket,
  )
  {
    let is_from_player : boolean = false;

    //on initialise la game avec les parametres de jeu envoye par le front
    this.param = this.gameService.initGame(match);
    this.logger.log("Start game");
    while (this.nbPlayer == 2 && !this.victory)
    {
      //on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie  
      this.server.on('new_position', async (data :Element) => {
        const user = await this.authenticationService.getUserFromSocket(client);
        is_from_player = this.setNewPosition(this.getPlayer(user.id), data);
        });
      
      //si un joueur a envoye une nouvelle position on recalcule les positions du jeu et on envoie les nouvelles infos
      if (is_from_player) {
        this.getNewFrame();
        this.server.emit('new_frame', this.param);
        is_from_player == false;
      }
    }

    if (this.victory)
      this.server.emit('finish_game', this.param);
    if (this.nbPlayer < 2)
      this.server.emit('interrupted_game');
  }
}
  