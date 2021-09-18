import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import User from '../users/user.entity';
import Message from './message.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => User, (member: User) => member.channels)
  @JoinTable()
  public members: User[];

  @Column({ default: false })
  public private: boolean;
  
  @Column({ default: null , nullable: true})
  public password: string;

  @ManyToOne(() => User, (owner: User) => owner.ownedChannels)
  public owner: User;

  @ManyToMany(() => User, (admin: User) => admin.chan_admin)
  @JoinTable()
  public admins: User[];

  // @ManyToMany(() => User, (banned: User) => banned.ban)
  // public banned: User[];

  // @ManyToMany(() => User, (muted: User) => muted.mute)
  // public muted: User[];

  @OneToMany(() => Message, (message: Message) => message.recipient)
  public historic: Message[];
}

export default Channel;