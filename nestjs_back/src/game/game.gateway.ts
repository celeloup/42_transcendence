import { Logger } from '@nestjs/common';
import {
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
import  ChannelService from '../channel/channel.service';
import Match from '../matches/match.entity';
import Round from './interface/round.interface';
import GameService from "./game.service";

 
@WebSocketGateway({ serveClient: false, namespace: '/game' })
export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("GameGateway");

  private connectedUsers: Map<Socket, string> = new Map();
  private counter: number = -1;

  constructor(
    private readonly authenticationService: ChannelService,
    private readonly gameService: GameService
  ) {}
  
  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.set(client, user.name);
    } else {
      this.connectedUsers.set(client, `client test`);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client);
  }
  
  @SubscribeMessage('launch_game')
  async launchGame(
    @MessageBody() match: Match,
  )
  {
    var param: Round;
    
    param = this.gameService.initGame(match);
  }
}
  