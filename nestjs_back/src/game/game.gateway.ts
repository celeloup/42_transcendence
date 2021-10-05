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
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Match from '../matches/match.entity';
import Round from './class/round.class';
import GameService from "./game.service";
import AuthenticationService from '../authentication/authentication.service';


@WebSocketGateway({ serveClient: false, namespace: '/game' })
export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("GameGateway");

  private connectedUsers: Map<number, Socket> = new Map();
  private usersRoom: Map<Socket, string> = new Map();
  private currentGames: Map<number, Round> = new Map();
  private inGame: number[] = [];

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
    
    //le user quitte ses rooms quand il est deco;
    this.usersRoom.delete(client);

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
    @MessageBody() room: number,
    @ConnectedSocket() client: Socket,
  ) {
      this.server.in(client.id).socketsJoin(room.toString());
      this.usersRoom.set(client, room.toString());
      this.logger.log(`Room ${room} joined`);
  }

  @SubscribeMessage('leave_game')
  async leaveRoom(
    @MessageBody() room: number,
    @ConnectedSocket() client: Socket,
  ) {
      client.leave(room.toString());
      this.usersRoom.delete(client);
      this.logger.log(`Room ${room} left`);
  }

  
  //est-ce qu'on revient ici si le jeux a ete interrompu ?
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
    @ConnectedSocket() client: Socket,
  ) {
    //on initialise la game avec les parametres de jeu envoye par le front et on l'ajoute aux matchs en cours
    let round = new Round(match.id.toString(), match.user1_id, match.user2_id, 10, 10, false);
    this.currentGames.set(match.id, round);

    //on lance le jeu 
    await this.gameService.startGame(this.server, round, this.connectedUsers, this.usersRoom, this.inGame);
   
    /////////////SAVE GAME /!\ Attention au cas ou il y a un abandon ////////////////////////

    //on supprime les joueurs et le jeu des listes en cours;
    delete this.inGame[round.id_player1];
    delete this.inGame[round.id_player2];
    this.currentGames.delete(match.id);
  }

  @SubscribeMessage('paddle_movement')
  async setNewPosition(
    @MessageBody() data: {id_game: number, y: number},
    @ConnectedSocket() client: Socket,
  ) {
    let player: number;
    let game = this.currentGames.get(data.id_game);

    this.logger.log(`Change paddle position game ${data.id_game}`);

    //on verifie l'id envoye en param
    if (!game) {
      this.logger.log(`This game doesn't exit, are you sure it's the good id?`);
      return ;
    }
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

  @SubscribeMessage('reset_counter')
  async resetCounter() {
    this.logger.log("Reseting...");
    this.i = 0;
  }

  @SubscribeMessage('get_users')
  async requestConnectedUsers(@ConnectedSocket() socket: Socket)
  {
    this.logger.log(`List of connected users`);
    socket.emit('connected_users', Array.from(this.connectedUsers.keys()), this.currentGames);
  }
}