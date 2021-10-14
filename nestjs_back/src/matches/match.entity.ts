import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({default: true})
  public friendly: boolean;

  @ManyToMany(() => User, (user: User) => user.matches)
  public users: User[];

  @Column({nullable: true})
  public user1_id: number;

  @Column()
  public user2_id: number;

  @Column({default: 0})
  public score_user1: number;

  @Column({default: 0})
  public score_user2: number;

  @Column({ nullable: true })
  public winner?: number;

  @Column({ nullable: true })
  public speed: number;

  @Column({ default: 10 })
  public goal: number;

  @Column({nullable: true, default: false})
  public boost_available: boolean;

  @Column({default: 1})
  public map: number;

  @CreateDateColumn()
  createdDate: Date;

}

export default Match;