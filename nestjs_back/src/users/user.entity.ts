import { Exclude, Expose } from 'class-transformer';
import Channel from '../channel/channel.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import Match from '../matches/match.entity';
import Achievement from '../achievements/achievement.entity'
 
@Entity()
@Exclude()
class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose({ groups: ['me'] })
  id42: number;

  @Column({ unique: true })
  @Expose({ groups: ['me'] })
  email: string;

  @Column({ unique: true })
  @Expose()
  name: string;

  @Column({nullable: true, default: false})
  @Expose()
  site_owner: boolean;

  @Column({nullable: true, default: false})
  @Expose()
  site_banned: boolean;

  @Column({nullable: true, default: false})
  @Expose()
  site_moderator: boolean

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  @Expose({ groups: ['me'] })
  isTwoFactorAuthenticationEnabled: boolean;

  @Expose({ groups: ['me'] })
  @ManyToMany(() => Channel, (channel: Channel) => channel.members)
  channels: Channel[];

  @Expose({ groups: ['me'] })
  @OneToMany(() => Channel, (channel: Channel) => channel.owner)
  ownedChannels: Channel[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => Channel, (channel: Channel) => channel.admins)
  chan_admin: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.banned)
  chan_banned: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.muted)
  chan_muted: Channel[];
  
  @Expose({ groups: ['infos'] })
  @ManyToMany(() => Match, (match: Match) => match.users)
  @JoinTable()
  matches: Match[];

  @ManyToMany(() => Achievement, (achievement: Achievement) => achievement.users)
  @Expose({ groups: ['infos'] })
  @JoinTable()
  achievements: Achievement[];

  @Column({ default: 0 })
  @Expose({ groups: ['infos'] })
  victories: number;

  @Column({ default: 0 })
  @Expose({ groups: ['infos'] })
  defeats: number;

  @Column({ default: 0 })
  @Expose({ groups: ['infos'] })
  points: number;

  @ManyToMany(() => User, (user: User) => user.friendOf)
  @JoinTable()
  @Expose({ groups: ['infos'] })
  friends: User[];

  @ManyToMany(() => User, (user: User) => user.friends)
  friendOf: User[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => User, (user: User) => user.blockedBy)
  @JoinTable()
  blocked: User[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => User, (user: User) => user.blocked)
  blockedBy: User[];

  @Column({nullable: true, default: null})
  @Expose({ groups: ['infos'] })
  public avatar: string;

  //  @Column("simple-array", {nullable: true})
  //  friends: string[];

  // @Column("int", {array: true, nullable: true})
  // friends: number[];

}

export default User;
