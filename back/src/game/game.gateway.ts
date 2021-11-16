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
import Round from './class/round.class';


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
			this.server.emit('update_online_users', Array.from(this.connectedUsers.keys()), this.gameService.getPlayingUsers());
		}
	}

	async handleDisconnect(client: Socket) {
		const user = await this.authenticationService.getUserFromSocket(client);

		//le user quitte ses rooms quand il est deco;
		this.gameService.leaveRoom(null, client, false);

		if (user) {
			this.connectedUsers.delete(user.id);
			this.logger.log(`Deconnection : ${user.name}`);
			this.server.emit('update_online_users', Array.from(this.connectedUsers.keys()), this.gameService.getPlayingUsers());
		}
	}

	@SubscribeMessage('join_game')
	async joinGame(
		@MessageBody() room: number,
		@ConnectedSocket() client: Socket,
	) {
		this.gameService.joinRoom(this.server, room.toString(), client)
	}

	@SubscribeMessage('leave_game')
	async leaveGame(
		@MessageBody() room: number,
		@ConnectedSocket() client: Socket,
	) {
		// Check if this room is a pending game
		let game = this.pendingGame.find(x => x.id === room);
		if (game)
		{
			const user = await this.authenticationService.getUserFromSocket(client);
			if (user && game.user1_id === user.id) {
				this.gameService.deleteMatchObjet(game.id);
				let i = this.pendingGame.indexOf(game);
				this.pendingGame.splice(i, 1);
			}
		}
		this.gameService.leaveRoom(room.toString(), client);
	}

	//envoie une invation pour jouer a un user
	@SubscribeMessage('send_invit')
	async sendGame(
		@MessageBody() match: Match,
		@ConnectedSocket() client: Socket,
	) {
		let guest_socket = this.connectedUsers.get(match.user2_id);
		if (!guest_socket) {
			client.emit('challenged_user_offline', match);
			return ;
		}
		guest_socket.emit('invitation', match);
		this.gameService.joinRoom(this.server, match.id.toString(), client);
	}
	
	//accepte une invitation a jouer, join les 2 joueurs dans la room et lance la partie
	@SubscribeMessage('accept_match')
	async acceptMatch(
		@MessageBody() match: Match,
		@ConnectedSocket() client: Socket,
	) {
		let sender_socket = this.connectedUsers.get(match.user1_id);
		
		//si l'host s'est deco entre temps on annule le match
		if (sender_socket === undefined) {
			client.emit('cancel_game', match.id.toString());
			return ;
		}

		this.gameService.joinRoom(this.server, match.id.toString(), client);
		this.gameService.launchGame(this.server, match, this.connectedUsers);
	}

	//refuse une invation, previens le joueur et suppr le match de la DB
	@SubscribeMessage('decline_match')
	async declineMatch(
		@MessageBody() match: Match,
		@ConnectedSocket() client: Socket,
	) {
		let sender_socket = this.connectedUsers.get(match.user1_id);
		if (sender_socket != undefined) {
			sender_socket.emit('invit_decline', match);
		}
		this.gameService.deleteMatchObjet(match.id);
	}

	//creer un game pour le MM, la partie est en attente
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

	//match un joueur avec un jeu attente, previent le user si aucun jeu n'est dispo
	@SubscribeMessage('match_player')
	async matchPlayer(
		@ConnectedSocket() client: Socket,
	) {
		if (this.pendingGame.length === 0) {
			client.emit('no_pending_game');
			return;
		}

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

	//recoit up ou down quand un player bouge son paddle
	@SubscribeMessage('paddle_movement')
	async setNewPosition(
		@MessageBody() data: { id_game: string, move: string },
		@ConnectedSocket() client: Socket,
	) {
		let player: number;
		let id: number = Number(data.id_game);
		let game: Round = this.gameService.getCurrentGames().get(id)[0];

		//on verifie l'id envoye en param
		if (game === undefined) {
			this.logger.log(`This game doesn't exit, are you sure it's the good id?`);
			return;
		}
		// this.logger.log(`Change paddle position game ${data.id_game}`);

		//on verifie que les nouvelles positions viennent bien des players et on actualise leur position dans les infos de la partie
		const user = await this.authenticationService.getUserFromSocket(client);
		if (user) {
			player = this.gameService.getPlayer(game, user.id);
			if (player == 1) {
				game.paddle_player1.setDirection(data.move);
			}
			else if (player == 2) {
				game.paddle_player2.setDirection(data.move);
			}
		}
	}

	//renvoie la liste des jeux en cours
	@SubscribeMessage('get_current_games')
	async requestCurrentGames(@ConnectedSocket() socket: Socket) {
		// this.logger.log(`List of current games`);
		socket.emit('current_games', Array.from(this.gameService.getCurrentGames().values()));
	}

	//renvoie la liste des users et des personnes en train de jouer
	@SubscribeMessage('get_users')
	async requestConnectedUsers(@ConnectedSocket() socket: Socket) {
		this.logger.log(`List of connected users and playing users`);
		socket.emit('connected_users', Array.from(this.connectedUsers.keys()), this.gameService.getPlayingUsers());
	}

	@SubscribeMessage('ban_site_user')
	async sendBanAlert(
		@MessageBody() id: number,
		@ConnectedSocket() client: Socket,
	) {
		let guest_socket = this.connectedUsers.get(id);
		if (!guest_socket) {
			return ;
		}
		guest_socket.emit('user_is_ban_site');
	}
}