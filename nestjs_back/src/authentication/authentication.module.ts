import { Module, HttpModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AuthenticationService from './authentication.service';
import UsersModule from '../users/users.module';
import AuthenticationController from './authentication.controller';
import JwtStrategy from './strategy/jwt.strategy';
import JwtRefreshTokenStrategy from './strategy/jwtRefresh.strategy';
import FortyTwoStrategy from './strategy/42.strategy';
import TwoFactorAuthenticationController from './twoFactor/twoFactorAuthentication.controller';
import TwoFactorAuthenticationService from './twoFactor/twoFactorAuthentication.service';
import JwtTwoFactorStrategy from './strategy/jwtTwoFactor.strategy';
 
@Module({
  imports: [
    UsersModule,
    HttpModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [AuthenticationService, TwoFactorAuthenticationService, FortyTwoStrategy, JwtStrategy, JwtRefreshTokenStrategy, JwtTwoFactorStrategy],
  controllers: [AuthenticationController, TwoFactorAuthenticationController]
})
export default class AuthenticationModule {}