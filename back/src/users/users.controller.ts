import { Body, Controller, Put, Req, Get, Res, UseGuards, Param, Delete, SerializeOptions, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import AddUserDto from './dto/addUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import Match from '../matches/match.entity';
import Channel from '../channel/channel.entity';
import Achievement from '../achievements/achievement.entity';
import userInfos from './interface/userInfos.interface';
import myUserInfos from 'src/authentication/interface/myUserInfos.interface';
import extendedUserInfos from './interface/extendedUserInfos.interface';

@SerializeOptions({
  groups: ['users']
})
@ApiTags('users')
@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService
  ) { }

  @ApiOperation({ summary: "Update the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: myUserInfos
  })
  @UseGuards(JwtTwoFactorGuard)
  @SerializeOptions({
    groups: ['me']
  })
  @Put('me')
  async changeName(@Req() req: RequestWithUser, @Body() user: UpdateUserDto): Promise<User> {
    return this.userService.changeName(req.user.id, user);
  }

  @ApiOperation({ summary: "Get all the users sorted by scores" })
  @ApiResponse({
    status: 200,
    type: [userInfos]
  })
  @SerializeOptions({
    groups: ['infos']
  })
  @Get('/ranked')
  GetRankedUsers() {
    return this.userService.getRankedUsers();
  }

  @ApiOperation({ summary: "Get all the users" })
  @ApiResponse({
    status: 200,
    type: [userInfos]
  })
  @Get()
  GetAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: "Get a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: userInfos
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @Get(':id')
  getById(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @ApiOperation({ summary: "Get matches of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: [Match]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @Get('matches/:id')
  getMatchesByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getMatchesByUserId(Number(id));
  }

  @ApiOperation({ summary: "Get channels of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: [Channel]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @Get('channels/:id')
  getChannelsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getChannelsByUserId(Number(id));
  }

  @ApiOperation({ summary: "Get achievements of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: [Achievement]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @Get('achievements/:id')
  getAchievementsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAchievementsByUserId(Number(id));
  }

  @ApiOperation({ summary: "Get friends of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: [userInfos]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @Get('friends/:id')
  getFriendsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getFriendsByUserId(Number(id));
  }

  @ApiOperation({ summary: "Get all infos of the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    type: extendedUserInfos
  })
  @UseGuards(JwtTwoFactorGuard)
  @SerializeOptions({
    groups: ['me', 'infos']
  })
  @Get('infos/me')
  getAllInfos(@Req() req: RequestWithUser) {
    const { user } = req;
    return this.userService.getAllInfosByUserId(user.id);
  }

  @ApiOperation({ summary: "Get all infos of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @ApiResponse({
    status: 200,
    type: User
  })
  @SerializeOptions({
    groups: ['infos']
  })
  @Get('infos/:id')
  getAllInfosByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAllInfosByUserId(Number(id));
  }

  @ApiOperation({ summary: "Add a friend to the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully added to friends',
    type: [User]
  })
  @UseGuards(JwtTwoFactorGuard)
  @Put('friend/me')
  addAFriend(@Req() req: RequestWithUser, @Body() friend: AddUserDto) {
    const { user } = req;
    return this.userService.addAFriend(user.id, friend.userId);
  }

  @ApiOperation({ summary: "Delete a friend of the authenticated user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'Friend successfully removed',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Delete('friend/me')
  deleteAFriend(@Req() req: RequestWithUser, @Body() friend: AddUserDto) {
    const { user } = req;
    return this.userService.deleteAFriend(user.id, friend.userId);
  }

  @ApiOperation({ summary: "Block a user for the authenticated user" })
  @ApiResponse({
    status: 200,
    description: 'User successfully blocked',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Put('block/me')
  blockAUser(@Req() req: RequestWithUser, @Body() friend: AddUserDto) {
    const { user } = req;
    return this.userService.blockAUser(user.id, friend.userId);
  }

  @ApiOperation({ summary: "Unblock a user for the authenticated user" })
  @ApiResponse({
    status: 200,
    description: 'User successfully unblocked',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Delete('block/me')
  unblockAUser(@Req() req: RequestWithUser, @Body() friend: AddUserDto) {
    const { user } = req;
    return this.userService.unblockAUser(user.id, friend.userId);
  }

  @ApiOperation({ summary: "Appoint moderator" })
  @ApiResponse({
    status: 200,
    description: 'User successfully promoted moderator',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Put('moderator/me')
  appointModerator(@Req() req: RequestWithUser, @Body() newModerator: AddUserDto) {
    const { user } = req;
    return this.userService.appointModerator(user.id, newModerator.userId);
  }

  @ApiOperation({ summary: "Revoke a moderator" })
  @ApiResponse({
    status: 200,
    description: 'User successfully demoted',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Delete('moderator/me')
  revokeModerator(@Req() req: RequestWithUser, @Body() newModerator: AddUserDto) {
    const { user } = req;
    return this.userService.revokeModerator(user.id, newModerator.userId);
  }

  @ApiOperation({ summary: "Ban a user from website" })
  @ApiResponse({
    status: 200,
    description: 'User successfully banned from the website',
    type: [User]
  }) 
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Put('ban/me')
  banUser(@Req() req: RequestWithUser, @Body() otherUser: AddUserDto) {
    const { user } = req;
    return this.userService.banUser(user.id, otherUser.userId);
  }

  @ApiOperation({ summary: "Unban a user from website" })
  @ApiResponse({
    status: 200,
    description: 'User successfully unbanned from the website',
    type: [User]
  })
  @ApiResponse({
    status: 404,
    description: 'User not found for this id'
  })
  @UseGuards(JwtTwoFactorGuard)
  @Delete('unban/me')
  unbanUser(@Req() req: RequestWithUser, @Body() otherUser: AddUserDto) {
    const { user } = req;
    return this.userService.unbanUser(user.id, otherUser.userId);
  }

  // Delete account not in subject? 
  // @Delete('/me')
  // @ApiOperation({ summary: "Delete a user//Not working so far" })
  // async deleteUser(@Param() { id }: FindOneParams) {
  //   return this.userService.deleteUser(Number(id));
  // }

  @Post('avatar/me')
  @ApiOperation({ summary: "Upload an avatar" })
  @ApiResponse({
    status: 201,
    description: 'Upload successful'
  })
  @ApiResponse({
    status: 415,
    description: 'Only jpg or png image files are allowed'
  })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @UseGuards(JwtTwoFactorGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      {
        storage: diskStorage({
          destination: './avatars',
          filename: editFileName
        }),
        fileFilter: imageFileFilter,
      }
    )
  )
  async uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    const { user } = req;
    this.userService.setAvatar(user.id, file.path);
  }

  @Get('avatar/:id')
  @ApiOperation({ summary: "Get avatar of a user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  async serveAvatar(@Param() { id }: FindOneParams, @Res() res: any): Promise<any> {
    return this.userService.serveAvatar(Number(id), res);
  }

}
