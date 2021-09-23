import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import GameService from "./game.service";

@Module({
	imports: [AuthenticationModule],
	providers: [GameGateway, GameService],
})
export default class GameModule {}