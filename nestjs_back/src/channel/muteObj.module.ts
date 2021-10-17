import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import muteObj from "./mute.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([muteObj]),
	],
})
export default class muteObjModule { }
