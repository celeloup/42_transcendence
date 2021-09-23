import { Body, Controller, Param, Put, Delete, Req, UseGuards, Post, Get, SerializeOptions } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
import UserDto from './dto/User.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
 
@SerializeOptions({
  groups: ['channel']
})
@ApiTags('channel')
@Controller('channel')
export default class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  @Get()
  @ApiOperation({summary: "Get all channels"})
  getAllChannels() {
    return this.channelService.getAllChannels();
  }

  @Get(':id')
  @ApiOperation({summary: "Get a channel by id"})
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @Get('owner/:id')
  @ApiOperation({summary: "Get owner by channel id"})
  getOwnerByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getOwnerByChannelId(Number(id));
  }

  @Get('members/:id')
  @ApiOperation({summary: "Get members by channel id"})
  getMembersByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getMembersByChannelId(Number(id));
  }

  @Get('admins/:id')
  @ApiOperation({summary: "Get admins by channel id"})
  getAdminsByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAdminsByChannelId(Number(id));
  }

  @Get('infos/:id')
  @ApiOperation({summary: "Get informations by channel id"})
  getAllInfosChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAllInfosByChannelId(Number(id));
  }

  @Post()
  @ApiOperation({summary: "Create a new channel"})
  async createChannel(@Body() channel: CreateChannelDto){
    return this.channelService.createChannel(channel);
  }

  @Put('members/:id')
  @ApiOperation({summary: "Add new member to a channel by channel id"})
  addMember(@Param() { id }: FindOneParams, @Body() member: UserDto) {
    return this.channelService.addMember(Number(id), member.userId);
  }

  @Delete('members/:id')
  @ApiOperation({summary: "Delete member of a channel by channel id"})
  deleteMember(@Param() { id }: FindOneParams, @Body() member: UserDto){
    return this.channelService.deleteMember(Number(id), member.userId)
  }

  @Put('admins/:id')
  @ApiOperation({summary: "Add new admin to a channel by channel id"})
  addAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.addAdmin(Number(id), admin.userId);
  }

  @Delete('admins/:id')
  @ApiOperation({summary: "Delete admin to a channel by channel id"})
  revokeAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.revokeAdmin(Number(id), admin.userId)
  }

  @Put('ban/:id')
  @ApiOperation({summary: "Ban member of a channel by channel id"})
  banAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.banAMember(Number(id), admin.userId);
  }

  @Delete('ban/:id')
  @ApiOperation({summary: "Unban member of a channel by channel id"})
  unbanAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unbanAMember(Number(id), admin.userId)
  }

  @Put('mute/:id')
  @ApiOperation({summary: "Mute member of a channel by channel id"})
  muteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.muteAMember(Number(id), admin.userId);
  }

  @Delete('mute/:id')
  @ApiOperation({summary: "Unmute member of a channel by channel id"})
  unmuteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unmuteAMember(Number(id), admin.userId)
  }
}