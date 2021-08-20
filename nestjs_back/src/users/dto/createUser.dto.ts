import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateUserDto {
	@IsNumber()
  public id42: number;
  
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
	name: string;

  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}