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
  private victory: boolean = false;

  private i: number = 0;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly gameService: GameService,
  ) {}  

  //a deplacer dans service ?
  getPlayer(id: number){
    if (!this.param)
      return 0;
    if (id === this.param.id_player1)
      return 1;
    if (id === this.param.id_player2)
      return 2;
    return 0;
  }

  hasVictory() {  
    if (this.param.score_player1 == this.param.goal || this.param.score_player2 == this.param.goal)
      this.victory == true;
  }

  updateFrame() {
    this.param.puck.update();
    //ici on fait les nouveaux calculs
    //verifier la victoire seulement lorsqu'il y a un changement de points
    this.hasVictory();
  }

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user)
    {
      this.connectedUsers.set(user.id, client); 
      if (this.getPlayer(user.id))
        this.nbPlayer++;

    }
    else
    {
      this.connectedUsers.set(this.i, client);
      if (this.getPlayer(this.i))
        this.nbPlayer++;
      this.i++;
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user)
    {  
      this.connectedUsers.delete(user.id);
      if (this.getPlayer(user.id))
        this.nbPlayer--;
    }
    else {
      for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          this.connectedUsers.delete(key);
          if (this.getPlayer(key))
           this.nbPlayer--;
          break;
        }
      }
    }
  }

  //est-ce qu'on revient ici si le jeux a ete interrompu ?
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
    @ConnectedSocket() client: Socket,
  )
  {
    //on initialise la game avec les parametres de jeu envoye par le front
   this.param = new Round(match.user1_id, match.user2_id, 10, 10, false);
    // this.param = new Round(0, 1, 10, 10, false);

    //on verifie si les joueurs sont deja co pour lancer la partie, sinon on attend
    for (let [key, value] of this.connectedUsers.entries()) {
        if (value === client) {
          if (this.getPlayer(key))
           this.nbPlayer++;
        }
      }
    
    this.logger.log("Start game");

    while (this.nbPlayer == 2 && !this.victory)
    { 
      //timer (ms)
      await new Promise(f => setTimeout(f, 60));
      this.updateFrame();
      this.server.emit('new_frame', this.param);
    }

    if (this.victory)
      this.server.emit('finish_game', this.param);
    if (this.nbPlayer < 2)
      this.server.emit('interrupted_game');
  }
  
  @SubscribeMessage('paddle_movement')
  async setNewPosition(
    @MessageBody() paddle: Paddle,
    @ConnectedSocket() client: Socket,
  )
  {
    let player: number;

    //on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie  
    const user = await this.authenticationService.getUserFromSocket(client);
    player = this.getPlayer(user.id); 
   

    if (player == 1) {
      this.param.paddle_player1.x = paddle.x;
      this.param.paddle_player1.y = paddle.y;
    }
    else if (player == 2) {
      this.param.paddle_player2.x = paddle.x;
      this.param.paddle_player2.y = paddle.y;
    }
  } 
}
  