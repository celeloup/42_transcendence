import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import Channel from 'src/channel/channel.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public id42: number;

  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  @Column()
  public name: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
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
