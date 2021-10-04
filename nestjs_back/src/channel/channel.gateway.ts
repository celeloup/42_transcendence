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
import AuthenticationService from '../authentication/authentication.service'
import Channel from './channel.entity';
import Match from 'src/matches/match.entity';
import ChannelService from './channel.service';
 
@WebSocketGateway({ serveClient: false, namespace: '/channel' })
export default class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("ChannelGateway");

  private connectedUsers: Map<Socket, string> = new Map();

  constructor(
    private readonly channelService: ChannelService,
    private readonly authenticationService: AuthenticationService
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
    this.logger.log(`Connection: ${this.connectedUsers.get(client)}`);
    this.server.emit('connected_users', Array.from(this.connectedUsers.values()));
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnect: ${this.connectedUsers.get(client)}`);
    this.connectedUsers.delete(client);
    this.server.emit('connected_users', Array.from(this.connectedUsers.values()));
  }
 
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() data: {content: string, recipient: Channel},
    @ConnectedSocket() client: Socket,
  ) {
     const author = await this.authenticationService.getUserFromSocket(client);
      this.logger.log(`Message from ${this.connectedUsers.get(client)} to ${data.recipient.name}: ${data.content}`);
      const message = await this.channelService.saveMessage(data.content, author, data.recipient);
      //est-ce que j'envoie directement aux membres du channel connecte ou c'est overkill par rapport au front ?
      this.server.emit('receive_message', data);
    }

  @SubscribeMessage('request_messages')
  async requestMessagesByChannel(
    @ConnectedSocket() socket: Socket,
    @MessageBody() channel: Channel,
  )
  {
    this.logger.log(`Request message of ${channel.name}`);
    const messages = await this.channelService.getMessageByChannel(channel);
    socket.emit('messages_channel', messages);
  }

  @SubscribeMessage('send_invit')
  async sendGameInvit(
    @MessageBody() data: {guest: string, match: Match},
  )
  {
    for (let [key, value] of this.connectedUsers.entries()) {
      if (value === data.guest)
        var socket = key;
    }
    this.logger.log(`Game invitation for ${data.guest}`);
    if (socket)
      socket.emit('game_invit', data.match);
  }
}
