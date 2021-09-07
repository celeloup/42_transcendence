import { Module } from "@nestjs/common";
import SocketGateway from "./socket.gateway";
import AuthenticationModule from "src/authentication/authentication.module";
import SocketService from "./socket.service";

@Module({
	imports: [AuthenticationModule],
	providers: [SocketGateway, SocketService],
})
export default class SocketModule {}