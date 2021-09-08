import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, RelationId, CreateDateColumn } from 'typeorm';
import User from '../users/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public friendly: boolean;

  @ManyToOne(() => User, (user: User) => user.matches1)
  public user1: User;

  @ManyToOne(() => User, (user: User) => user.matches2)
  public user2: User; 

  // @RelationId((match: Match) => match.user1)
  @Column()
  public user1_id: number;

  // @RelationId((match: Match) => match.user2)
  @Column()
  public user2_id: number;

  @Column({nullable: true})
  public score_user1: number;

  @Column({nullable: true})
  public score_user2: number;

  @Column({ nullable: true })
  public winner?: number;

  @CreateDateColumn()
  createdDate: Date;

}

export default Match;