import { IsNotEmpty, IsString } from 'class-validator';

export default class TwoFactorAuthenticationCodeDto {
  @IsString()
  @IsNotEmpty()
  twoFactorAuthenticationCode: string;
}