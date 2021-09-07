import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
 
@Entity()
class Match {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public friendly: boolean;
  
  @Column()
  public user1: number;

  @Column()
  public user2: number;
  
  @Column()
  public score_user1: number;

  @Column()
  public score_user2: number;
  
  @Column({nullable: true}) 
  public winner?: number;

}
 
export default Match;