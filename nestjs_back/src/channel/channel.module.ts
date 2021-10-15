import { Module } from "@nestjs/common";
import ChannelGateway from "./channel.gateway";
import AuthenticationModule from "../authentication/authentication.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import ChannelService from "./channel.service";
import Message from "./message.entity";
import User from "../users/user.entity";
import UsersModule from "../users/users.module";
import Channel from './channel.entity';
import ChannelController from "./channel.controller";

@Module({
	imports: [
		AuthenticationModule,
		TypeOrmModule.forFeature([Channel, Message, User]),
		UsersModule,
	],
	providers: [ChannelGateway, ChannelService],
	controllers: [ChannelController],
	exports: [ChannelService] 
})
export default class ChannelModule { }
