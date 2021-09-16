import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateChannelDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  owner_id: number;
}