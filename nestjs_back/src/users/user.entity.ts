import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, Unique, JoinColumn, RelationId } from 'typeorm';
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

  @ManyToMany(() => Match, (match: Match) => match.users)
  @JoinTable()
  public matches: Match[];

  @Column()
  public victories: number;

  @Column()
  public defeats: number;

  @Column()
  public points: number;

  // @ManyToMany(() => User, (user:User) => user.friends)
  @Column("simple-array", {nullable: true})
  public friends: string[];
}
 
export default User;