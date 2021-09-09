import { Module } from "@nestjs/common";
import ChannelGateway from "./channel.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelService from "./channel.service";
import Message from "./message.entity";

@Module({
	imports: [AuthenticationModule,
	TypeOrmModule.forFeature([Message]),
	],
	providers: [ChannelGateway, ChannelService],
})
export default class ChannelModule {}