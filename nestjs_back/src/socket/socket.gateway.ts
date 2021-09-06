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
 
@WebSocketGateway(8082, { path: '/socket', serveClient: false, namespace: '/messages' })
export default class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private logger: Logger = new Logger("SocketGateway");
  
  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Connection: client ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnect: client ${client.id}`);
  }

  @SubscribeMessage("Hello_server")
  handleHello(client: Socket, text: string): WsResponse<string> {
    this.logger.log(`Hello from ${client.id}: ${text}`);
    return { event: "receive_message", data: `Hello from server!` };
  }

  @SubscribeMessage("send_to_all")
  handleBroadcast(client: Socket, text: string): void {
    this.logger.log(`Message from ${client.id}: ${text}`);
    this.server.emit("receive_message", text);
  }
}
  