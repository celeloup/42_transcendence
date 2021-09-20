import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get } from '@nestjs/common';
import AchievementsService from './achievements.service';
import CreateAchievementDto from './dto/createAchievement.dto'
import FindOneParams from '../utils/findOneParams';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('achievements')
@Controller('achievements')
export default class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService
  ) { }

  @Get(':id')
  @ApiOperation({summary: "Get an achievement by id"})
  getAchievementById(@Param() { id }: FindOneParams) {
    return this.achievementsService.getAchievementById(Number(id));
  }

  @Post()
  @ApiOperation({summary: "Create a new achievement"})
  async createAchievement(@Body() achievement: CreateAchievementDto) {
    return this.achievementsService.createAchievement(achievement);
  }
}