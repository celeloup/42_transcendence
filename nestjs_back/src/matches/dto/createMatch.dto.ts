import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateMatchDto {  
  @IsNumber()
  user1: number;

  @IsNumber()
  user2: number;
  
  @IsNumber()
  score_user1: number;

  @IsNumber()
  score_user2: number;
  
  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}