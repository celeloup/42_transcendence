import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public id: number;

  @Column({ unique: true })
  @ApiProperty()
  public id42: number;
 
  @Column({ unique: true })
  @ApiProperty()
  public email: string;

  @Column({ unique: true })
  @ApiProperty()
  public name: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  @ApiProperty()
  public isTwoFactorAuthenticationEnabled: boolean;

}
 
export default User;