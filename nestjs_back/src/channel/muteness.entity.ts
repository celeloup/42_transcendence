import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Type } from 'class-transformer';
import User from '../users/user.entity';
import Channel from './channel.entity';

@Entity()
class Muteness {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Type(() => Channel)
  @ManyToMany(() => Channel, (channel: Channel) => channel.historic)
  public channel: Channel;

  @Type(() => User)
  @ManyToMany(() => User)
  public user: User;

  @ManyToOne(() => Channel, (channel: Channel) => channel.historic)
  public endOfMute: Date;

  @UpdateDateColumn()
  public lastupdate: Date;
}

//export default Muteness;
