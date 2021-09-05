import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateMatchDto {
	@IsNumber()
  public id: number;
  
  @IsNumber()
  public user1: number;

  @IsNumber()
  public user2: number;
  
  @IsNumber()
  public score_user1: number;

  @IsNumber()
  public score_user2: number;
  
  @IsNumber()
  public winner?: number;
  
  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}