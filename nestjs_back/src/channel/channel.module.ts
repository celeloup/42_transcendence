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
import { channels } from './channels.json';
import UsersService from "../users/users.service";

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
export default class ChannelModule {
	constructor(
    private readonly channelService: ChannelService,
    private readonly usersService: UsersService,
    ) {
    for (const channel of channels) {
      this.channelService.getChannelByName(channel.name)
      .catch(async () => {
        let trials = 5;
        while (trials) {
          try {
            const { id } = await this.usersService.getByName(channel.owner)
            delete channel.owner
            this.channelService.createChannel(channel, id);
            return;
          } catch (error) {
            await new Promise(f => setTimeout(f, 1000));
          }
          --trials;
        }
        delete channel.owner;
        this.channelService.createChannel(channel, 1);
      });
    }
  }
}
