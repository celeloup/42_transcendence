import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
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
    const achievement = await this.achievementsRepository.findOne(name);
    if (achievement) {
      return achievement;
    }
    throw new HttpException('Achievement with this name does not exist', HttpStatus.NOT_FOUND);
  }

  async getAchievementById(id: number) {
    const achievement = await this.achievementsRepository.findOne(id);
    if (achievement) {
      return achievement;
    }
    throw new HttpException('Achievement with this id does not exist', HttpStatus.NOT_FOUND);
  }

  
  
  async createAchievement(achievementData: CreateAchievementDto) {
    const newAchievement = await this.achievementsRepository.create(achievementData);
    await this.achievementsRepository.save(newAchievement);
    return newAchievement;
  }
  
}