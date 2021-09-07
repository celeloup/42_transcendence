import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterDto {
  @ApiProperty()
  @IsNumber()
  id42: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

}