import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDto {
  @ApiProperty()
	@IsNumber()
  public id42: number;
  
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
	name: string;

  //@IsString()
  //@IsNotEmpty()
  //@MinLength(7)
	//password: string;
}