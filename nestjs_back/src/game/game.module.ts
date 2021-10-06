import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import GameService from "./game.service";
import MatchesModule from "src/matches/matches.module";

@Module({
	imports: [AuthenticationModule, MatchesModule],
	providers: [GameGateway, GameService],
})
export default class GameModule {}