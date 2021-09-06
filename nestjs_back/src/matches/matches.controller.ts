import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get } from '@nestjs/common';
import MatchesService from './matches.service';
import CreateMatchDto from './dto/createMatch.dto'
import FindOneParams from '../utils/findOneParams';
import getMatchById from './matches.service';
 
@Controller('matches')
export default class MatchesController {
  constructor(
    private readonly matchesService: MatchesService
  ) {}

  @Get(':id')
  getMatchById(@Param() { id }: FindOneParams) {
    return this.matchesService.getMatchById(Number(id));
  }


  @Post('create')
  @HttpCode(201)
  async createMatch(@Body() match: CreateMatchDto){
    return this.matchesService.createMatch(match);
  }

}