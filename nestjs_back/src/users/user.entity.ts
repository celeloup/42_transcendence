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
  @Expose({ groups: ['me'] })
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
  @Expose()
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
  public owned: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.admin)
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

  @Column()
  @Expose()
  @ApiProperty()
  public victories: number;

  @Column()
  @Expose()
  @ApiProperty()
  public defeats: number;

  @Column()
  @Expose()
  @ApiProperty()
  public points: number;

//  @Column("simple-array", {nullable: true})
//  public friends: string[];

  @Column("int", {array: true, nullable: true})
  @Expose()
  @ApiProperty()
  public friends: number[];
}

export default User;
