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
import { classToPlain } from 'class-transformer';


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
			return;
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
		@MessageBody() data: { channel: Channel, target: User, time: number },
		@ConnectedSocket() client: Socket,
	) {
		const user: User = await this.authenticationService.getUserFromSocket(client);
		let targetSocket: Socket = this.listSocket.get(data.target);
		if (user) {
			targetSocket.emit('user_muted');
		}
	}

	@SubscribeMessage('unmute_user')
	async unmuteUser(
		@MessageBody() data: { channel: Channel, target: User },
		@ConnectedSocket() client: Socket,
	) {
		const user: User = await this.authenticationService.getUserFromSocket(client);
		const targetSocket: Socket = this.listSocket.get(data.target);
		if (user) {
			targetSocket.emit('user_unmuted');
		}
	}

	@SubscribeMessage('ban_user')
	async banUser(
		@MessageBody() data: { channel: Channel, target: User },
		@ConnectedSocket() client: Socket,
	) {
		const user: User = await this.authenticationService.getUserFromSocket(client);
		const targetSocket: Socket = this.listSocket.get(data.target);

		if (user) {
			targetSocket.leave(data.channel.id.toString());
			targetSocket.emit('user_banned');
		}
	}

	@SubscribeMessage('send_message')
	async listenForMessages(
		@MessageBody() data: { content: string, recipient: Channel },
		@ConnectedSocket() client: Socket,
	) {
		let author: User = null;
		for (let [key, value] of this.listSocket.entries()) {
			if (value === client) {
				author = key;
				break;
			}
		}
		if (author) {

			if ((await this.channelService.isAuthorized(data.recipient.id, author)) == false) {
				this.logger.log('Unauthorized access');
				return;
			}

			this.logger.log(`Message from ${this.connectedUsers.get(client)} to ${data.recipient.name}: ${data.content}`);
			const message = await this.channelService.saveMessage(data.content, author, data.recipient);
			this.server.in(data.recipient.id.toString()).emit('receive_message', classToPlain(message));
		}
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
}
