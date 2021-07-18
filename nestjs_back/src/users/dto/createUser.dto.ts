import { IsEmail, IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
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
   
export default CreateUserDto;