import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import Channel from '../channel/channel.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, Unique, JoinColumn, RelationId } from 'typeorm';
import Match from '../matches/match.entity';
import Achievement from '../achievements/achievement.entity'
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public id: number;

  @Column({nullable: true})
  @ApiProperty()
  public admin: boolean;

  @Column({ unique: true })
  @ApiProperty()
  public id42: number;

  @Column({ unique: true })
  @ApiProperty()
  public email: string;

  @Column({ unique: true })
  @ApiProperty()
  public name: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
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
  @JoinTable()
  public matches: Match[];

  @ManyToMany(() => Achievement, (achievement: Achievement) => achievement.users)
  @JoinTable()
  public achievements: Achievement[];

  @Column({ default: 0 })
  @ApiProperty()
  public victories: number;

  @Column({ default: 0 })
  @ApiProperty()
  public defeats: number;

  @Column()
  @ApiProperty({ default: 0 })
  public points: number;

//  @Column("simple-array", {nullable: true})
//  public friends: string[];

  // @Column("int", {array: true, nullable: true})
  // public friends: number[];

  @ManyToMany(() => User, (user: User) => user.friendOf)
  @JoinTable()
  public friends: User[];

  @ManyToMany(() => User, (user: User) => user.friends)
  public friendOf: User[];

  @ManyToMany(() => User, (user: User) => user.blockedBy)
  @JoinTable()
  public blocked: User[];

  @ManyToMany(() => User, (user: User) => user.blocked)
  public blockedBy: User[];

}

export default User;
