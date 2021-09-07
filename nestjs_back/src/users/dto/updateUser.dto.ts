import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
	name: string;

}
   
export default UpdateUserDto;