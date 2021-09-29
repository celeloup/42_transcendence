import { Body, Controller, Param, Put, Delete, Req, UseGuards, Post, Get, SerializeOptions } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
import UserDto from './dto/User.dto';
import { ApiOperation, ApiParam, ApiTags, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import JwtTwoFactorGuard from 'src/authentication/guard/jwtTwoFactor.guard';
import User from 'src/users/user.entity';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';

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

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get(':id')
  @ApiOperation({summary: "Get a channel"})
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get('owner/:id')
  @ApiOperation({summary: "Get owner of a channel"})
  getOwnerByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getOwnerByChannelId(Number(id));
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get('members/:id')
  @ApiOperation({summary: "Get members of a channel"})
  getMembersByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getMembersByChannelId(Number(id));
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get('admins/:id')
  @ApiOperation({summary: "Get admins of a channel"})
  getAdminsByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAdminsByChannelId(Number(id));
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get('infos/:id')
  @ApiOperation({summary: "Get informations of a channel"})
  getAllInfosChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAllInfosByChannelId(Number(id));
  }

  @ApiOperation({ summary: "Create a channel with the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  @Post()
  @ApiOperation({summary: "Create a new channel"})
  async createChannel(@Req() req: RequestWithUser, @Body() channel: CreateChannelDto){
    const { user } = req;
    return this.channelService.createChannel(channel, user.id);
  }

  // Out of scope
  // @ApiOperation({ summary: "Delete a channel with the authenticated user" })
  // @ApiParam({name: 'id', type: Number, description: 'channel id'})
  // @ApiBearerAuth('bearer-authentication')
  // @ApiCookieAuth('cookie-authentication')
  // @UseGuards(JwtTwoFactorGuard)
  // @Delete('/:id')
  // @ApiOperation({summary: "Delete a channel"})
  // async deleteChannel(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
  //   const { user } = req;
  //   return this.channelService.deleteChannel(Number(id), user.id);
  // }

  @ApiOperation({ summary: "Leave a channel with the authenticated user" })
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  @ApiOperation({summary: "Delete a channel"})
  async leaveChannel(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
    const { user } = req;
    return this.channelService.leaveChannel(Number(id), user.id);
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Put('members/:id')
  @ApiOperation({summary: "Add new member to a channel"})
  addMember(@Param() { id }: FindOneParams, @Body() member: UserDto) {
    return this.channelService.addMember(Number(id), member.userId);
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Delete('members/:id')
  @ApiOperation({summary: "Delete member of a channel"})
  removeMember(@Param() { id }: FindOneParams, @Body() member: UserDto){
    return this.channelService.removeMember(Number(id), member.userId)
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Put('admins/:id')
  @ApiOperation({summary: "Add new admin to a channel"})
  addAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.addAdmin(Number(id), admin.userId);
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Delete('admins/:id')
  @ApiOperation({summary: "Delete admin to a channel"})
  revokeAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.revokeAdmin(Number(id), admin.userId)
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Put('ban/:id')
  @ApiOperation({summary: "Ban member of a channel"})
  banAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.banAMember(Number(id), admin.userId);
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Delete('ban/:id')
  @ApiOperation({summary: "Unban member of a channel"})
  unbanAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unbanAMember(Number(id), admin.userId)
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Put('mute/:id')
  @ApiOperation({summary: "Mute member of a channel"})
  muteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.muteAMember(Number(id), admin.userId);
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Delete('mute/:id')
  @ApiOperation({summary: "Unmute member of a channel"})
  unmuteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unmuteAMember(Number(id), admin.userId)
  }

  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @Get('messages/:id')
  @ApiOperation({summary: "Get messages of a channel"})
  getMessages(@Param() { id }: FindOneParams) {
    return this.channelService.getMessages(Number(id));
  }
}