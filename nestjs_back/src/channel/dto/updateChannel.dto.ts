import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateChannelDto {

  @IsString()
  @IsNotEmpty()
  name: string;
  
}
   
export default UpdateChannelDto;