import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import SocketService from './socket.service';
 
@WebSocketGateway(8082, { path: '/socket', serveClient: false, namespace: '/test' })
export default class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("SocketGateway");

  private connectedUser: Map<string, string> = new Map();
  private counter: number = -1;

  constructor(
    private readonly socketService: SocketService
  ) {}
  
  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  async handleConnection(client: Socket, ...args: any[]) {
    if (this.counter == -1) {
      this.connectedUser.set(client.id, "connector");
      this.logger.log(`Connection: ${this.connectedUser.get(client.id)}`);
      this.counter++;
    } else {
      const user = await this.socketService.getUserFromSocket(client);
      this.connectedUser.set(client.id, user ? user.name : `client ${this.counter++}`);
      this.logger.log(`Connection: ${this.connectedUser.get(client.id)}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnect: ${this.connectedUser.get(client.id)}`);
    this.connectedUser.delete(client.id);
  }

  @SubscribeMessage("Hello_server")
  handleHello(client: Socket, text: string): WsResponse<string> {
    this.logger.log(`Hello from ${this.connectedUser.get(client.id)}: ${text}`);
    return { event: "receive_message", data: `Hello from server!` };
  }

  @SubscribeMessage("send_to_all")
  handleBroadcast(client: Socket, text: string): void {
    this.logger.log(`Message from ${this.connectedUser.get(client.id)}: ${text}`);
    this.server.emit("receive_message", text);
  }

  @SubscribeMessage("reset_counter")
  handleReset(): void {
    this.logger.log('Client counter reset');
    this.counter = -1;
  }
}
  