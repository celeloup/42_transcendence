import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { toDataURL, toFileStream } from 'qrcode';
import { Response } from 'express';
 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(otpauthUrl: string) {
    const response = await toDataURL(otpauthUrl);
    return response; 
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }
}