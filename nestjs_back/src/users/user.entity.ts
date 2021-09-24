import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import Channel from '../channel/channel.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import Match from '../matches/match.entity';
import Achievement from '../achievements/achievement.entity'
 
@Entity()
@Exclude()
class User {
  @PrimaryGeneratedColumn()
  @Expose({ groups: ['me', 'channel', 'users'] })
  @ApiProperty()
  public id: number;

  @Column({nullable: true})
  @Expose({ groups: ['me'] })
  @ApiProperty()
  public admin: boolean;

  @Column({ unique: true })
  @Expose({ groups: ['me'] })
  @ApiProperty()
  public id42: number;

  @Column({ unique: true })
  @Expose({ groups: ['me'] })
  @ApiProperty()
  public email: string;

  @Column({ unique: true })
  @Expose({ groups: ['channel', 'users'] })
  @ApiProperty()
  public name: string;

  @Column({ nullable: true })
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  @Expose({ groups: ['me'] })
  @ApiProperty()
  public isTwoFactorAuthenticationEnabled: boolean;

  @ManyToMany(() => Channel, (channel: Channel) => channel.members)
  public channels: Channel[];

  @OneToMany(() => Channel, (channel: Channel) => channel.owner)
  public ownedChannels: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.admins)
  public chan_admin: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.banned)
  public ban: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.muted)
  public mute: Channel[];
  
  @ManyToMany(() => Match, (match: Match) => match.users)
  @Expose()
  @JoinTable()
  public matches: Match[];

  @ManyToMany(() => Achievement, (achievement: Achievement) => achievement.users)
  @Expose()
  @JoinTable()
  public achievements: Achievement[];

  @Column({ default: 0 })
  @Expose({ groups: ['matches'] })
  @ApiProperty()
  public victories: number;

  @Column()
  @Expose({ groups: ['matches'] })
  @ApiProperty()
  public defeats: number;

  @Column()
  @ApiProperty({ default: 0 })
  @Expose({ groups: ['matches'] })
  public points: number;

  @ManyToMany(() => User, (user: User) => user.friendOf)
  @ApiProperty()
  @JoinTable()
  @Expose()
  public friends: User[];

  @ManyToMany(() => User, (user: User) => user.friends)
  public friendOf: User[];

  @ManyToMany(() => User, (user: User) => user.blockedBy)
  @JoinTable()
  @Expose({ groups: ['users'] })
  public blocked: User[];

  @ManyToMany(() => User, (user: User) => user.blocked)
  public blockedBy: User[];

  @Column({nullable: true, default: ''})
  public avatar: string;

  //  @Column("simple-array", {nullable: true})
  //  public friends: string[];

  // @Column("int", {array: true, nullable: true})
  // public friends: number[];

}

export default User;
