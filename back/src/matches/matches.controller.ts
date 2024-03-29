import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get, SerializeOptions, Delete } from '@nestjs/common';
import MatchesService from './matches.service';
import CreateMatchDto from './dto/createMatch.dto'
import FindOneParams from '../utils/findOneParams';
import UpdateMatchDto from './dto/updateMatch.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@SerializeOptions({
  groups: ['matches']
})
@ApiTags('matches')
@Controller('matches')
export default class MatchesController {
  constructor(
    private readonly matchesService: MatchesService
  ) {}

  @Get()
  @ApiOperation({summary: "Get all matches / open route - only for admins at the end"})
  getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @ApiParam({name: 'id', type: Number, description: 'match id'})
  @Get(':id')
  @ApiOperation({summary: "Get a match"})
  @SerializeOptions({
    groups: ['infos']
  })
  getMatchById(@Param() { id }: FindOneParams) {
    return this.matchesService.getMatchById(Number(id));
  }

  @Post()
  @ApiOperation({summary: "Create a new match"})
  @SerializeOptions({
    groups: ['infos']
  })
  async createMatch(@Body() match: CreateMatchDto){
    return this.matchesService.createMatch(match);
  }

  // @ApiParam({name: 'id', type: Number, description: 'match id'})
  // @Put(':id')
  // @ApiOperation({summary: "Update a match"})
  // async updateMatch(@Param() { id }: FindOneParams, @Body() match: UpdateMatchDto){
  //   return this.matchesService.updateMatchTest(Number(id), match);
  // }

  @Delete('/:id')
  @ApiParam({name: 'id', type: Number, description: 'match id'})
  @ApiOperation({summary: "Delete a match"})
  async deleteMatch(@Param() { id }: FindOneParams){
    return this.matchesService.deleteMatch(Number(id));
  }
}
