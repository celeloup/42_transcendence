import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
}