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
import GameService from "./game.service";
import AuthenticationService from '../authentication/authentication.service';


@WebSocketGateway({ serveClient: false, namespace: '/game' })
export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	private server: Server;
	private logger: Logger = new Logger("GameGateway");

	private connectedUsers: Map<number, Socket> = new Map();
	private pendingGame: Match[] = [];

	constructor(
		private readonly authenticationService: AuthenticationService,
		private readonly gameService: GameService,
	) { }

	afterInit(server: Server) {
		this.logger.log("Initialized")
	}

	async handleConnection(client: Socket) {
		const user = await this.authenticationService.getUserFromSocket(client);
		if (user) {
			this.connectedUsers.set(user.id, client);
			this.logger.log(`Connection : ${user.name}`);
		}
	}

	async handleDisconnect(client: Socket) {
		const user = await this.authenticationService.getUserFromSocket(client);

		//le user quitte ses rooms quand il est deco;
		this.gameService.leaveRoom(null, client, false);

		if (user) {
			this.connectedUsers.delete(user.id);
			this.logger.log(`Deconnection : ${user.name}`);
		}
	}

	@SubscribeMessage('join_game')
	async joinGame(
		@MessageBody() room: number,
		@ConnectedSocket() client: Socket,
	) {
		this.gameService.joinRoom(this.server, client.toString(), client)
	}

	@SubscribeMessage('leave_game')
	async leaveGame(
		@MessageBody() room: number,
		@ConnectedSocket() client: Socket,
	) {
		this.gameService.leaveRoom(room.toString(), client);
	}

	@SubscribeMessage('create_game')
	async createGame(
		@MessageBody() match: Match,
		@ConnectedSocket() client: Socket,
	) {
		for (let [key, value] of this.connectedUsers.entries()) {
			if (value === client) {
				match.user1_id = key;
				break;
			}
		}
		this.pendingGame.push(match);
		this.gameService.joinRoom(this.server, match.id.toString(), client);
		this.logger.log(`Game ${match.id} created`);
	}

	@SubscribeMessage('match_player')
	async matchPlayer(
		@ConnectedSocket() client: Socket,
	) {
		let game = this.pendingGame.shift();

		for (let [key, value] of this.connectedUsers.entries()) {
			if (value === client) {
				game.user2_id = key;
				break;
			}
		}
		this.gameService.joinRoom(this.server, game.id.toString(), this.connectedUsers.get(game.user2_id));
		this.gameService.launchGame(this.server, game, this.connectedUsers);
	}

	@SubscribeMessage('paddle_movement')
	async setNewPosition(
		@MessageBody() data: { id_game: number, move: string },
		@ConnectedSocket() client: Socket,
	) {
		let player: number;
		let game = this.gameService.getCurrentGames().get(data.id_game);

		//on verifie l'id envoye en param
		if (!game) {
			this.logger.log(`This game doesn't exit, are you sure it's the good id?`);
			return;
		}
		this.logger.log(`Change paddle position game ${data.id_game}`);
		//on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie
		const user = await this.authenticationService.getUserFromSocket(client);
		if (user) {
			player = this.gameService.getPlayer(game, user.id);
			if (player == 1) {
				this.gameService.movePaddle(game.paddle_player1, data.move);
			}
			else if (player == 2) {
				this.gameService.movePaddle(game.paddle_player2, data.move);
			}
		}
	}

	@SubscribeMessage('get_current_games')
	async requestCurrentGames(@ConnectedSocket() socket: Socket) {
		this.logger.log(`List of current games`);
		socket.emit('connected_users', Array.from(this.gameService.getCurrentGames().keys()));
	}

	@SubscribeMessage('get_users')
	async requestConnectedUsers(@ConnectedSocket() socket: Socket) {
		this.logger.log(`List of connected users and playing users`);
		socket.emit('connected_users', Array.from(this.connectedUsers.keys()), this.gameService.getPlayingUsers());
	}

}