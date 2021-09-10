import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;
  
  @ManyToOne(() => User)
  public author: User;

  //@ManyToOne(() => Channel)
  // public recipient: string;

  @Column()
  public recipient: string;
  }

export default Message;
