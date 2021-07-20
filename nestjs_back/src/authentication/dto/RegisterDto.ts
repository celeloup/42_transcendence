import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

class RegisterDto {
  @IsNumber()
  id42: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

}

export default RegisterDto;