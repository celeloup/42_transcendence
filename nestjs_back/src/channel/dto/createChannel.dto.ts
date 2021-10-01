import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export default class CreateChannelDto {

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  type: number;//(1 = public, 2 = private, 3 = mp)

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password?: string;
 
  @IsNumber({},{each: true})
  @IsArray()
  @ApiProperty()
  members: number[];

}