import { Module, HttpModule } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './42.strategy';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';
import { UsersService } from 'src/users/users.service';
 
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
  providers: [AuthenticationService, TwoFactorAuthenticationService, FortyTwoStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthenticationController, TwoFactorAuthenticationController]
})
export class AuthenticationModule {}