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
import Channel from './channel.entity';
import Match from 'src/matches/match.entity';
import User from 'src/users/user.entity';
import AuthenticationService from '../authentication/authentication.service';
import ChannelService from './channel.service';
import { channel } from 'diagnostics_channel';
import { classToClass, classToPlain } from 'class-transformer';


@WebSocketGateway({ serveClient: false, namespace: '/channel' })
export default class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("ChannelGateway");

  private connectedUsers: Map<Socket, string> = new Map();
  private listSocket: Map<User, Socket> = new Map();

  constructor(
    private readonly channelService: ChannelService,
    private readonly authenticationService: AuthenticationService
  ) { }

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.authenticationService.getUserFromSocket(client);
    if (user) {
      this.connectedUsers.set(client, user.name);
      this.listSocket.set(user, client);
    }
    //else throw error ?
    this.logger.log(`Connection: ${this.connectedUsers.get(client)}`);
    this.server.emit('connected_users', Array.from(this.connectedUsers.values()));
  }

  async handleDisconnect(client: Socket) {
    const user: User = await this.authenticationService.getUserFromSocket(client);
    this.logger.log(`Disconnect: ${this.connectedUsers.get(client)}`);
    this.connectedUsers.delete(client);
    this.listSocket.delete(user);
    this.server.emit('connected_users', Array.from(this.connectedUsers.values()));
  }

  @SubscribeMessage('join_chan')
  async joinRoom(
    @MessageBody() room: number,
    @ConnectedSocket() client: Socket,
  ) {
    const user: User = await this.authenticationService.getUserFromSocket(client);
    const is_member: boolean = await this.channelService.isAMember(room, user.id);
    const is_ban: boolean = await this.channelService.isBanned(room, user.id);

    if (is_member && is_ban) {
      this.logger.log('User has been ban');
      return ;
    }
    //add member to the channel (nothing happen if already ban);
    if (!is_member) {
      this.channelService.addMember(room, user.id, user.id);
    }
    this.server.in(client.id).socketsJoin(room.toString());
    this.logger.log(`Client ${this.connectedUsers.get(client)} joined room ${room}`);
  }

  @SubscribeMessage('leave_chan')
  async leaveRoom(
    @MessageBody() room: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room.toString());
    this.logger.log(`Client ${this.connectedUsers.get(client)} left room ${room}`);
  }

  @SubscribeMessage('mute_user')
  async muteUser(
    @MessageBody() data: { channel: Channel, member: User, time: number },
    @ConnectedSocket() client: Socket,
  ) {
    const user: User = await this.authenticationService.getUserFromSocket(client);
    let memberSocket: Socket = this.listSocket.get(data.member);
    if (user) {
      await this.channelService.muteAMember(data.channel.id, data.member.id, data.time, user.id);
      memberSocket.emit('user_muted');
    }
  }

  @SubscribeMessage('unmute_user')
  async unmuteUser(
    @MessageBody() data: { channel: Channel, member: User },
    @ConnectedSocket() client: Socket,
  ) {
    const user: User = await this.authenticationService.getUserFromSocket(client);
    const memberSocket: Socket = this.listSocket.get(data.member);
    if (user) {
      memberSocket.emit('user_unmuted');
    }
  }

  @SubscribeMessage('ban_user')
  async banUser(
    @MessageBody() data: { channel: Channel, member: User },
    @ConnectedSocket() client: Socket,
  ) {
    const user: User = await this.authenticationService.getUserFromSocket(client);
    const memberSocket: Socket = this.listSocket.get(data.member);
    
    if (user) {
      memberSocket.leave(data.channel.id.toString());
      memberSocket.emit('user_banned');
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() data: { content: string, recipient: Channel },
    @ConnectedSocket() client: Socket,
  ) {
    const author = await this.authenticationService.getUserFromSocket(client);
    // const user = await this.authenticationService.getUserFromSocket(client);
    // const author = classToClass(user);
    const is_member: boolean = await this.channelService.isAMember(data.recipient.id, author.id);
    const is_banned: boolean = await this.channelService.isBanned(data.recipient.id, author.id);
    const is_muted: boolean = await this.channelService.isMuted(data.recipient.id, author.id);

    if (!(is_member) || is_banned || is_muted) {
      this.logger.log('Unauthorized access');
      return ;
    }
    this.logger.log(`Message from ${this.connectedUsers.get(client)} to ${data.recipient.name}: ${data.content}`);
    const message = await this.channelService.saveMessage(data.content, author, data.recipient);
    this.server.in(data.recipient.id.toString()).emit('receive_message', classToPlain(message));
  }

  // @SubscribeMessage('request_messages')
  // async requestMessagesByChannel(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() channel: Channel,
  // ) {
  //   this.logger.log(`Request message of ${channel.name}`);
  //   const messages = await this.channelService.getMessageByChannel(channel);
  //   socket.emit('messages_channel', messages);
  // }

  @SubscribeMessage('get_users')
  async requestConnectedUsers(@ConnectedSocket() socket: Socket) {
    this.logger.log(`List of connected users`);
    socket.emit('connected_users', Array.from(this.connectedUsers.values()));
  }

  @SubscribeMessage('send_invit')
  async sendGameInvit(
    @MessageBody() data: { guest: string, match: Match },
  ) {
    for (let [key, value] of this.connectedUsers.entries()) {
      if (value === data.guest)
        var socket = key;
    }
    this.logger.log(`Game invitation for ${data.guest}`);
    if (socket)
      socket.emit('game_invit', data.match);
  }
}
