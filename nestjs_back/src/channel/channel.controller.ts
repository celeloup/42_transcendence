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

  @Get()
  getAllChannels() {
    return this.channelService.getAllChannels();
  }

  @Get(':id')
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @Get('owner/:id')
  getOwnerByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getOwnerByChannelId(Number(id));
  }

  @Get('members/:id')
  getMembersByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getMembersByChannelId(Number(id));
  }

  @Get('admins/:id')
  getAdminsByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAdminsByChannelId(Number(id));
  }

  @Get('infos/:id')
  getAllInfosChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAllInfosByChannelId(Number(id));
  }


  @Post()
  async createChannel(@Body() channel: CreateChannelDto){
    return this.channelService.createChannel(channel);
  }



/*   @Put(':id')
  async updateChannel(@Param() { id }: FindOneParams, @Body() match: UpdateChannelDto){
    return this.channelService.updateChannel(Number(id), match);
  } */
}