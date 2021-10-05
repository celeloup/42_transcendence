import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn } from 'typeorm';
import User from '../users/user.entity';
import { Exclude } from 'class-transformer';

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

  @Column({nullable: true})
  public score_user1: number;

  @Column({nullable: true})
  public score_user2: number;

  @Column({ nullable: true })
  public winner?: number;

  @Column({ nullable: true })
  public speed: number;

  @Column({ default: 10 })
  public goal: number;

  @Column({nullable: true, default: false})
  public boost_available: boolean;

  @CreateDateColumn()
  createdDate: Date;

}

export default Match;