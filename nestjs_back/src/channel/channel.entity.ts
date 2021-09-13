import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import User from '../users/user.entity';
import Message from './message.entity';


//add channl dans users
@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => User, (member: User) => member.channels)
  public members: User[];

  @Column({ default: false })
  public private: boolean;
  
  @Column({ default: null })
  public password: string;

  @ManyToOne(() => User, (owner: User) => owner.owned)
  public owner: User;

  @ManyToMany(() => User, (admin: User) => admin.admin)
  public admin: User[];

  @ManyToMany(() => User, (banned: User) => banned.ban)
  public banned: User[];

  @ManyToMany(() => User, (muted: User) => muted.mute)
  public muted: User[];

  @OneToMany(() => Message, (message: Message) => message.channel)
  public historic: Message[];
}

export default Channel;