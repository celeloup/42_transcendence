import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, CreateDateColumn } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Achievement {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @ManyToMany(() => User, (user: User) => user.achievements)
  public users: User[];

}

export default Achievement;