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
import ChannelService from './channel.service'
 
@WebSocketGateway({ serveClient: false, namespace: '/channel' })
export default class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("ChannelGateway");

  private connectedUser: Map<string, string> = new Map();
  private socketUsers: Map<string, Socket> = new Map();

  constructor(
    private readonly channelService: ChannelService
  ) {}

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.channelService.getUserFromSocket(client);
    if (user) {
      //si id compris dans client pourquoi ne pas garder qu'une map socket user ?
     this.connectedUser.set(client.id, user.name);
      this.socketUsers.set(client.id, client);
    }
    this.logger.log(`Connection: ${this.connectedUser.get(client.id)}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnect: ${this.connectedUser.get(client.id)}`);
    this.connectedUser.delete(client.id);
    this.socketUsers.delete(client.id);
  }

  /*remplacer recipient string par channel une fois cree
  	on emit le message a tous les users connecte du chan ?
  */
  
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string, recipient: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message from ${this.connectedUser.get(client.id)}: ${content}`);
    this.server.sockets.emit('receive_message', content);
  }

}
