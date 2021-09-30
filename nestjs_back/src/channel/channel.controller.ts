import { Body, Controller, Param, Put, Delete, Req, UseGuards, Post, Get, SerializeOptions } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
import UserDto from './dto/User.dto';
import { ApiOperation, ApiParam, ApiTags, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import JwtTwoFactorGuard from 'src/authentication/guard/jwtTwoFactor.guard';
import User from 'src/users/user.entity';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import NewPasswordDto from './dto/newPassword.dto';

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
  @ApiOperation({summary: "Get a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getChannelById(@Param() { id }: FindOneParams) {
    return this.channelService.getChannelById(Number(id));
  }

  @Get('owner/:id')
  @ApiOperation({summary: "Get owner of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getOwnerByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getOwnerByChannelId(Number(id));
  }

  @Get('members/:id')
  @ApiOperation({summary: "Get members of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getMembersByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getMembersByChannelId(Number(id));
  }

  @Get('admins/:id')
  @ApiOperation({summary: "Get admins of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getAdminsByChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAdminsByChannelId(Number(id));
  }

  @Get('infos/:id')
  @ApiOperation({summary: "Get informations of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getAllInfosChannelId(@Param() { id }: FindOneParams) {
    return this.channelService.getAllInfosByChannelId(Number(id));
  }

  @Post()
  @ApiOperation({ summary: "Create a channel with the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
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

  @Delete('/:id')
  @ApiOperation({ summary: "Leave a channel with the authenticated user" })
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  @ApiOperation({summary: "Delete a channel"})
  async leaveChannel(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
    const { user } = req;
    return this.channelService.leaveChannel(Number(id), user.id);
  }

  @Put('password/:id')
  @ApiOperation({ summary: "Change/set password of a channel with the authenticated OWNER" })
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  @ApiOperation({summary: "Delete a channel"})
  async changePassword(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() password: NewPasswordDto){
    const { user } = req;
    return this.channelService.changePassword(Number(id), user.id, password);
  }

  @Put('members/:id')
  @ApiOperation({summary: "Add new member to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  addMember(@Param() { id }: FindOneParams, @Body() member: UserDto) {
    return this.channelService.addMember(Number(id), member.userId);
  }

  @Delete('members/:id')
  @ApiOperation({summary: "Delete member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  removeMember(@Param() { id }: FindOneParams, @Body() member: UserDto){
    return this.channelService.removeMember(Number(id), member.userId)
  }

  @Put('admins/:id')
  @ApiOperation({summary: "Add new admin to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  addAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.addAdmin(Number(id), admin.userId);
  }

  @Delete('admins/:id')
  @ApiOperation({summary: "Delete admin to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  revokeAdmin(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.revokeAdmin(Number(id), admin.userId)
  }

  @Put('ban/:id')
  @ApiOperation({summary: "Ban member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  banAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.banAMember(Number(id), admin.userId);
  }

  @Delete('ban/:id')
  @ApiOperation({summary: "Unban member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  unbanAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unbanAMember(Number(id), admin.userId)
  }

  @Put('mute/:id')
  @ApiOperation({summary: "Mute member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  muteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto) {
    return this.channelService.muteAMember(Number(id), admin.userId);
  }

  @Delete('mute/:id')
  @ApiOperation({summary: "Unmute member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  unmuteAMember(@Param() { id }: FindOneParams, @Body() admin: UserDto){
    return this.channelService.unmuteAMember(Number(id), admin.userId)
  }

  @Get('messages/:id')
  @ApiOperation({summary: "Get messages of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  getMessages(@Param() { id }: FindOneParams) {
    return this.channelService.getMessagesByChannelId(Number(id));
  }
}