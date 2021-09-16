import { Body, Controller, HttpCode, Param, Put, Req, UseGuards, Post, Get } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
// import UpdateChannelDto from './dto/updateChannel.dto.ts';
 
@Controller('channel')
export default class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  @Get(':id')
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @Post()
  async createChannel(@Body() match: CreateChannelDto){
    return this.channelService.createChannel(match);
  }

/*   @Put(':id')
  async updateChannel(@Param() { id }: FindOneParams, @Body() match: UpdateChannelDto){
    return this.channelService.updateChannel(Number(id), match);
  } */
}