import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get, SerializeOptions, Delete } from '@nestjs/common';
import MatchesService from './matches.service';
import CreateMatchDto from './dto/createMatch.dto'
import FindOneParams from '../utils/findOneParams';
import UpdateMatchDto from './dto/updateMatch.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@SerializeOptions({
  groups: ['matches']
})
@ApiTags('matches')
@Controller('matches')
export default class MatchesController {
  constructor(
    private readonly matchesService: MatchesService
  ) {}

  @Get(':id')
  @ApiOperation({summary: "Get a match by id"})
  getMatchById(@Param() { id }: FindOneParams) {
    return this.matchesService.getMatchById(Number(id));
  }

  @Post()
  @ApiOperation({summary: "Create a new match"})
  async createMatch(@Body() match: CreateMatchDto){
    return this.matchesService.createMatch(match);
  }

  @Put(':id')
  @ApiOperation({summary: "Update a match by id"})
  async updateMatch(@Param() { id }: FindOneParams, @Body() match: UpdateMatchDto){
    return this.matchesService.updateMatch(Number(id), match);
  }

  @Delete('/:id')
  @ApiOperation({summary: "Delete a match"})
  async deleteMatch(@Param() { id }: FindOneParams){
    return this.matchesService.deleteMatch(Number(id));
  }
}