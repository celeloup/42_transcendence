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
import Channel from './channel.entity';
 
@WebSocketGateway({ serveClient: false, namespace: '/channel' })
export default class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("ChannelGateway");

  private connectedUsers: Map<string, string> = new Map();
  private socketUsers: Map<string, Socket> = new Map();

  constructor(
    private readonly channelService: ChannelService
  ) {}

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  //est-ce qu'il faut emit une notif au serveur des que quelqu'un se co/deco ?
  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.channelService.getUserFromSocket(client);
    if (user) {
      //si id compris dans client pourquoi ne pas garder qu'une map socket user ?
      this.connectedUsers.set(client.id, user.name);
      this.socketUsers.set(client.id, client);
    } else {
      this.connectedUsers.set(client.id, `client test`);
    }
    this.logger.log(`Connection: ${this.connectedUsers.get(client.id)}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnect: ${this.connectedUsers.get(client.id)}`);
    this.connectedUsers.delete(client.id);
    this.socketUsers.delete(client.id);
  }

  /*remplacer recipient string par channel une fois cree
  	on emit le message a tous les users connecte du chan ?
  */
  
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() data: {content: string, recipient: Channel},
    @ConnectedSocket() client: Socket,
  ) {
     const author = await this.channelService.getUserFromSocket(client);
      this.logger.log(`Message from ${this.connectedUsers.get(client.id)} to ${data.recipient.name}: ${data.content}`);
      const message = await this.channelService.saveMessage(data.content, author, data.recipient);
      //est-ce que j'envoie directement aux membres du channel connecte ou c'est overkill ?
      this.server.sockets.emit('receive_message', data);
    }

  @SubscribeMessage('request_messages')
  async requestMessagesByChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() channel: Channel,
  )
  {
    this.logger.log(`Request message of ${channel.name}`);
    const messages = await this.channelService.getMessageByChannel(channel);
    socket.emit('messagesByChannel', messages);
  }

  @SubscribeMessage('get_users')
  async requestConnectedUsers(@ConnectedSocket() socket: Socket)
  {
    this.logger.log(`List of connected users`);
    socket.emit('connectedUsers', Array.from(this.connectedUsers.values()));
  }
}
