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
import Match from '../matches/match.entity';
import { users } from './users.json';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Achievement, Match]),
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
export default class UsersModule {
  constructor(private readonly usersService: UsersService) {
    for (const user of users) {
      this.usersService.getBy42Id(user.id42)
      .then(response => {
        if (!response) {
          this.usersService.create(user)
        }
      })
    }
  }
}