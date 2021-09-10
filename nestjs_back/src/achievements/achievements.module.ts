import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AchievementsService from './achievements.service';
import Achievement from './achievement.entity';
import User from '../users/user.entity'
import AchievementsController from './achievements.controller';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement])
  ],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService]
})
export default class AchievementsModule {}