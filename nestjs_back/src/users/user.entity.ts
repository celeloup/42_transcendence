import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import Match from '../matches/match.entity';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({nullable: true})
  public admin: boolean;

  @Column({ unique: true })
  public id42: number;
 
  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  public name: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @OneToMany(() => Match, (match: Match) => match.user1)
  public matches1: Match[];

  @OneToMany(() => Match, (match: Match) => match.user2)
  public matches2: Match[]; 
}
 
export default User;