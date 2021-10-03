import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class LoginDto {
  @ApiProperty()
  @IsNumber()
  id42: number;
}