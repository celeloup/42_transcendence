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
export default class AchievementsModule {
  constructor(private readonly achievementsService: AchievementsService) {
    const achievements = [
      {
        name: 'first_friend',
        description: 'Congratulations, you made a friend ! You are not alone anymore in this big universe ...'
      },
      {
        name: '10_victories',
        description: '10 victories ? You are on a roll !'
      },
      {
        name: '100_victories',
        description: 'A HUNDRED POINTS ?! You are a real pro gamer ! GG !'
      }
    ]
    for (const achievement of achievements) {
      this.achievementsService.getAchievementByName(achievement.name)
      .then(response => {
        if (!response) {
          this.achievementsService.createAchievement(achievement)
        }
      })
    }
  }
}