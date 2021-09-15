import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import Channel from 'src/channel/channel.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public id: number;

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
  public owned: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.admin)
  public chan_admin: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.banned)
  public ban: Channel[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.muted)
  public mute: Channel[];
}

export default User;
