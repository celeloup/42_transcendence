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
        name: "Newbie",
        description: "Play your first game",
        type: 1,
        level: 1
      },
      {
        name: "Casual",
        description: "Play 10 games",
        type: 1,
        level: 2
      },
      {
        name: "Nolife",
        description: "Play 100 games",
        type: 1,
        level: 3
      },
      {
        name: "Must Be Luck",
        description: "Win your first game",
        type: 2,
        level: 1
      },
      {
        name: "Getting there",
        description: "Win 10 games",
        type: 2,
        level: 2
      },
      {
        name: "Pro Gamer",
        description: "Win 50 games",
        type: 2,
        level: 3
      },
      {
        name: "So Alone...",
        description: "Make your first friend",
        type: 3,
        level: 1
      },
      {
        name: "Not So Alone",
        description: "Make 5 friends",
        type: 3,
        level: 2
      },
      {
        name: "Social Butterfly",
        description: "Make 10 friends",
        type: 3,
        level: 3
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