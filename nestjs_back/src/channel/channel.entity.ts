import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, OneToMany, JoinTable, ObjectID, ObjectIdColumn, Index, UpdateDateColumn } from 'typeorm';
import { Type } from 'class-transformer';
import User from '../users/user.entity';
import Message from './message.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ default: 1 })
  public type: number;//  (1 = public, 2 = private, 3 = mp)
  
  @Column({ default: null , nullable: true})
  public password: string;

  @Type(() => User)
  @ManyToOne(() => User, (owner: User) => owner.ownedChannels)
  public owner: User;

  @Type(() => User)
  @ManyToMany(() => User, (admin: User) => admin.chan_admin)
  @JoinTable()
  public admins: User[];

  @ManyToMany(() => User, (member: User) => member.channels)
  @JoinTable()
  public members: User[];

  // @Column("int", {array: true, nullable: true})
  // public members_id: number[];

  @Type(() => User)
  @ManyToMany(() => User, (banned: User) => banned.ban)
  @JoinTable()
  public banned: User[];

  @Type(() => User)
  @ManyToMany(() => User, (muted: User) => muted.mute)
  @JoinTable()
  public muted: User[];

  @OneToMany(() => Message, (message: Message) => message.recipient)
  public historic: Message[];

  @UpdateDateColumn()
  public lastupdate: Date;
}

export default Channel;