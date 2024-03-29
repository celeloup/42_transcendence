import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, CreateDateColumn } from 'typeorm';
import User from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Achievement {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @ApiProperty()
  public name: string;

  @Column()
  @ApiProperty()
  public description: string;

  @Column()
  @ApiProperty()
  public level: number;

  @Column()
  @ApiProperty()
  public type: number;

  @ManyToMany(() => User, (user: User) => user.achievements)
  public users: User[];

}

export default Achievement;