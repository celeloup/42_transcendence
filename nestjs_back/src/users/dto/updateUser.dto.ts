import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsNotEmpty()
	name: string;

}
   
export default UpdateUserDto;