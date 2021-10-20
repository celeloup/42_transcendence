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
import muteObj from "./mute.entity";
import muteObjModule from "./muteObj.module";

@Module({
	imports: [
		AuthenticationModule,
		TypeOrmModule.forFeature([Channel, Message, User, muteObj]),
		UsersModule,
		muteObjModule
	],
	providers: [ChannelGateway, ChannelService],
	controllers: [ChannelController],
	exports: [ChannelService] 
})
export default class ChannelModule { }
