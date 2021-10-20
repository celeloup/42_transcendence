import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Channel from "./channel.entity";
import { Type } from "class-transformer";

@Entity()
class muteObj {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;


	@Column({type: 'bigint'})
	silencedUntil: string;//date in milliseconds since 1970

	@Type(() => Channel)
	@ManyToOne(() => Channel, (channel: Channel) => channel.muteDates)
	channel: Channel;
}

export default muteObj; 