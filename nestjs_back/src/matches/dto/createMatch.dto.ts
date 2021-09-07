import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateMatchDto {
  @ApiProperty()
	@IsNumber()
  public id: number;
  
  @ApiProperty()
  @IsNumber()
  public user1: number;

  @ApiProperty()
  @IsNumber()
  public user2: number;
  
  @ApiProperty()
  @IsNumber()
  public score_user1: number;

  @ApiProperty()
  @IsNumber()
  public score_user2: number;
  
  @ApiPropertyOptional()
  @IsNumber()
  public winner?: number;
  
  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}