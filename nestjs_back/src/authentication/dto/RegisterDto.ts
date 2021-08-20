import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class RegisterDto {
  @IsNumber()
  id42: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

}