import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateChannelDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  
}
   
export default UpdateChannelDto;