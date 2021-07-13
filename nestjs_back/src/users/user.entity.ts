import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
//import Post from '../posts/post.entity';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @Column()
  @Exclude()
  public password: string;

  // EXAMPLE -> relation one to many: a post have one user / a user can have multiple posts
  //@OneToMany(() => Post, (post: Post) => post.author)
  //public posts: Post[];
}
 
export default User;