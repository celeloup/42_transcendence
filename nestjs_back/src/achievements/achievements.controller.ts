import { Body, Controller, Param, HttpException, HttpStatus, Post, Get } from '@nestjs/common';
import AchievementsService from './achievements.service';
import CreateAchievementDto from './dto/createAchievement.dto'
import FindOneParams from '../utils/findOneParams';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('achievements')
@Controller('achievements')
export default class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService
  ) { }

  @ApiParam({name: 'id', type: Number, description: 'achievement id'})
  @Get(':id')
  @ApiOperation({summary: "Get an achievement"})
  async getAchievementById(@Param() { id }: FindOneParams) {
    const achievement = await this.achievementsService.getAchievementById(Number(id));
    if (!achievement) {
      throw new HttpException('Achievement with this id does not exist', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiOperation({summary: "Create a new achievement"})
  async createAchievement(@Body() achievement: CreateAchievementDto) {
    return this.achievementsService.createAchievement(achievement);
  }
}