import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
 
@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public pg_id?: number;

	@Column()
  public id: number;
  
  @Column()
  public user1: number;

  @Column()
  public user2: number;
  
  @Column()
  public score_user1: number;

  @Column()
  public score_user2: number;
  
  @Column()
  public winner?: number;

}

 
export default Match;