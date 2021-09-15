import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../users/user.entity';
import Channel from './channel.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;
  
  @ManyToOne(() => User)
  public author: User;

  @ManyToOne(() => Channel, (channel: Channel) => channel.historic)
  public recipient: Channel;

  }

export default Message;
