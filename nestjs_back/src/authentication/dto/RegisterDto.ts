import { IsEmail, IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

class RegisterDto {
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

export default RegisterDto;