import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class TwoFactorAuthenticationCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  twoFactorAuthenticationCode: string;
}