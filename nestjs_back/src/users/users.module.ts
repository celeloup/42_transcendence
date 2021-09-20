import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import UsersService from './users.service';
import User from './user.entity';
import JwtStrategy from '../authentication/strategy/jwt.strategy';
import UsersController from './users.controller';
import AchievementsModule from '../achievements/achievements.module';
import Achievement from '../achievements/achievement.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement]),
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
    AchievementsModule
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService]
})
export default class UsersModule {}