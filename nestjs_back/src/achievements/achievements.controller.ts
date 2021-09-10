import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get } from '@nestjs/common';
import AchievementsService from './achievements.service';
import CreateAchievementDto from './dto/createAchievement.dto'
import FindOneParams from '../utils/findOneParams';

@Controller('achievements')
export default class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService
  ) { }

  @Get(':id')
  getAchievementById(@Param() { id }: FindOneParams) {
    return this.achievementsService.getAchievementById(Number(id));
  }

  @Post()
  async createAchievement(@Body() achievement: CreateAchievementDto) {
    return this.achievementsService.createAchievement(achievement);
  }
}