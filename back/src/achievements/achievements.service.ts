import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateAchievementDto from './dto/createAchievement.dto';
import Achievement from '../achievements/achievement.entity';
 
@Injectable()
export default class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementsRepository: Repository<Achievement>
  ) {}

  async getAchievementByName(name: string) {
    return await this.achievementsRepository.findOne({name});
  }

  async getAchievementById(id: number) {
    return await this.achievementsRepository.findOne({id});
  }
  
  async createAchievement(achievementData: CreateAchievementDto) {
    const newAchievement = await this.achievementsRepository.create(achievementData);
    await this.achievementsRepository.save(newAchievement);
    return newAchievement;
  }
  
}