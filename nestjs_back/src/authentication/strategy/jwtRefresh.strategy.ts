import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import UsersService from '../../users/users.service';
import TokenPayload from '../interface/tokenPayload.interface';
 
@Injectable()
export default class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
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
        return request?.cookies?.Refresh;
      }]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
 
  async validate(request: Request, payload: TokenPayload) {
    let refreshToken = request.cookies?.Refresh;
    if (!refreshToken) {
      refreshToken = request?.headers?.authorization?.split(' ')[1] as string
    }
    const user = await this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.userId)
    if (user) {
      if (!user.isTwoFactorAuthenticationEnabled) {
        return user;
      }
      if (payload.isSecondFactorAuthenticated) {
        return user;
      }
    }
  }
}