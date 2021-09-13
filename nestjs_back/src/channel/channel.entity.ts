import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../users/user.entity';

@Entity()
class Channel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: name;

  @ManyToMany(() => User, (member: User) => member.channels)
  @JoinTable()
  public members: User[];

  @Column({ default: false })
  public private: boolean;
  
  @Column({ default: null })
  public password: string;

  

}

export default Channel;
