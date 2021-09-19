import { Body, Controller, Param, Post, Get, SerializeOptions } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import UpdateChannelDto from './dto/updateChannel.dto.ts';
 
@ApiTags('channel')
@Controller('channel')
export default class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  @Get(':id')
  @ApiOperation({summary: "Get a channel by id"})
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @Post()
  @ApiOperation({summary: "Create a new channel"})
  async createChannel(@Body() channel: CreateChannelDto){
    return this.channelService.createChannel(channel);
  }

/*   @Put(':id')
  async updateChannel(@Param() { id }: FindOneParams, @Body() match: UpdateChannelDto){
    return this.channelService.updateChannel(Number(id), match);
  } */
}