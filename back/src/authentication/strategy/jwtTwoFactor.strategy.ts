import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import UsersService from '../../users/users.service';
import TokenPayload from '../interface/tokenPayload.interface';

@Injectable()
export default class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        const bearer = request?.headers?.authorization as string
        if (bearer) {
          return bearer.split(' ')[1]
        }
        return request?.cookies?.Authentication;
      }]),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
 
  async validate(payload: TokenPayload) {
    try {
      const user = await this.userService.getById(payload.userId);
      if (!user.isTwoFactorAuthenticationEnabled) {
        return user;
      }
      if (payload.isSecondFactorAuthenticated) {
        return user;
      }
    } catch (error) {
      return null;
    }
  }
}