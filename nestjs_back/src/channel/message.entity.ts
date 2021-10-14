import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Type } from 'class-transformer';
import User from '../users/user.entity';
import Channel from './channel.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @Type(() => User)
  @ManyToOne(() => User)
  public author: User;

  @ManyToOne(() => Channel, (channel: Channel) => channel.historic)
  public recipient: Channel;

  @UpdateDateColumn()
  public lastupdate: Date;
}

export default Message;
