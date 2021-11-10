import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AchievementsService from './achievements.service';
import Achievement from './achievement.entity';
import AchievementsController from './achievements.controller';
import { achievements } from './achievements.json';
 
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