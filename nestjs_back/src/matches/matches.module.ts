import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import MatchesService from './matches.service';
import Match from './match.entity';
import User from '../users/user.entity'
import MatchesController from './matches.controller';
import UsersModule from '../users/users.module'
import Achievement from 'src/achievements/achievement.entity';
import AchievementsModule from 'src/achievements/achievements.module';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Match, User, Achievement]),
    UsersModule,
    AchievementsModule
  ],
  providers: [MatchesService],
  controllers: [MatchesController],
  exports: [MatchesService]
})
export default class MatchesModule {}