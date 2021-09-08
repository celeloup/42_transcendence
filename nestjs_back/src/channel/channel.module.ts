import { Module } from "@nestjs/common";
import ChannelGateway from "./channel.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import ChannelService from "./channel.service";

@Module({
	imports: [AuthenticationModule],
	providers: [ChannelGateway, ChannelService],
})
export default class ChannelModule {}