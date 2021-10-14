import { Body, Controller, Param, Put, Delete, Req, UseGuards, Post, Get } from '@nestjs/common';
import ChannelService from './channel.service';
import CreateChannelDto from './dto/createChannel.dto'
import FindOneParams from '../utils/findOneParams';
import UserDto from './dto/User.dto';
import { ApiOperation, ApiParam, ApiTags, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import JwtTwoFactorGuard from 'src/authentication/guard/jwtTwoFactor.guard';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import NewPasswordDto from './dto/newPassword.dto';

@ApiTags('channel')
@Controller('channel')
export default class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  //change to only site admin at the end
  @Get()
  @ApiOperation({summary: "Get all channels / Open route for the moment => In the end for admins only"})
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

  //Change for site admins at the end
  @Get('messages')
  @ApiOperation({summary: "Get all messages // open route for now; for site admins only in the end"})
  getAllMessages() {
    return this.channelService.getAllMessagesOfAllChannels();
  }

  @Post()
  @ApiOperation({ summary: "Create a channel with the authenticated user / NB: members are id numbers not strings / 1 for public, 2 for private, 3 for MP" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  async createChannel(@Req() req: RequestWithUser, @Body() channel: CreateChannelDto){
    const { user } = req;
    return this.channelService.createChannel(channel, user.id);
  }

  @Put('leave/:id')
  @ApiOperation({ summary: "Leave a channel with the authenticated user" })
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  async leaveChannel(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
    const { user } = req;
    return this.channelService.removeFromChannel(Number(id), user.id, user.id);
  }

  @Put('password/:id')
  @ApiOperation({ summary: "Change/set password of a channel with the authenticated OWNER" })
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  async changePassword(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() password: NewPasswordDto){
    const { user } = req;
    return this.channelService.changePassword(Number(id), user.id, password);
  }

  @Put('members/:id')
  @ApiOperation({summary: "Join channel/Add new member to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  addMember(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() member: UserDto) {
    const { user } = req;
    return this.channelService.addMember(Number(id), member.userId, user.id);
  }

  @Put('admins/:id')
  @ApiOperation({summary: "Add new admin to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  addAdmin(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() admin: UserDto) {
    const {user} = req;
    return this.channelService.addAdmin(Number(id), admin.userId, user.id);
  }

  @Delete('admins/:id')
  @ApiOperation({summary: "Delete admin to a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  revokeAdmin(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() admin: UserDto){
    const {user} = req;
    return this.channelService.revokeAdmin(Number(id), admin.userId, user.id)
  }

  @Put('ban/:id')
  @ApiOperation({summary: "Ban a member from a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  BanMember(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() member: UserDto){
    const { user } = req;
    return this.channelService.banAMember(Number(id), member.userId, user.id)
  }

  @Put('unban/:id')
  @ApiOperation({summary: "Unban member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  unbanAMember(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() member: UserDto){
    const {user} = req;
    return this.channelService.unbanAMember(Number(id), member.userId, user.id)
  }

  @Put('mute/:id')
  @ApiOperation({summary: "Mute member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  muteAMember(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() member: UserDto) {
    const {user} = req;
    return this.channelService.muteAMember(Number(id), member.userId, user.id);
  }

  @Put('unmute/:id')
  @ApiOperation({summary: "Unmute member of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  unmuteAMember(@Req() req: RequestWithUser, @Param() { id }: FindOneParams, @Body() member: UserDto){
    const {user} = req;
    return this.channelService.unmuteAMember(Number(id), member.userId, user.id)
  }

  @Get('messages/:id')
  @ApiOperation({summary: "Get messages of a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  getMessages(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
    const {user} = req;
    return this.channelService.getMessagesByChannelId(Number(id), user.id);
  }

  @Delete('delete/:id')
  @ApiOperation({summary: "Delete a channel"})
  @ApiParam({name: 'id', type: Number, description: 'channel id'})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  deleteChannel(@Req() req: RequestWithUser, @Param() { id }: FindOneParams){
    const {user} = req;
    return this.channelService.deleteChannel(Number(id), user.id)
  }

}