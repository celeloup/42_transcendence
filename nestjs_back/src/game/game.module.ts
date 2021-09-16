import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";
import AuthenticationModule from "../authentication/authentication.module";


@Module({
	imports: [AuthenticationModule],
	providers: [GameGateway],
})
export default class GameModule {}