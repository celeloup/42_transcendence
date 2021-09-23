import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export default class CreateChannelDto {

  @IsString()
  @ApiProperty()
  name : string;

  @IsNumber()
  type : number;//(1 = public, 2 = private, 3 = mp)

  @IsString()
  password: string;

  @IsArray()
  members: number[];

  @IsNumber()
  owner_id: number; //TEMPORARY

}