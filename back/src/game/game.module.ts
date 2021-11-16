import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import GameService from "./game.service";
import MatchesModule from "src/matches/matches.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import Match from "src/matches/match.entity";

@Module({
	imports: [AuthenticationModule, MatchesModule],
	providers: [GameGateway, GameService],
})
export default class GameModule {}