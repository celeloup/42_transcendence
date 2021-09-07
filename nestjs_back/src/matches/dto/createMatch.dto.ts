import { IsEmail, IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export default class CreateMatchDto {  
  @IsBoolean()
  friendly: boolean;
  
  @IsNumber()
  user1: number;

  @IsNumber()
  user2: number;
  
  @IsNumber()
  score_user1: number;

  @IsNumber()
  score_user2: number;
  
  @IsNumber()
  winner: number;
  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}