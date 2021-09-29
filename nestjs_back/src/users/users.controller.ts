import { Body, Controller, Put, Req, Get, Res, UseGuards, Param, Delete, SerializeOptions, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import AddFriendDto from './dto/addFriend.dto';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { extname } from  'path';
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
  SERVER_URL:  string  =  "http://localhost:8080/";
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

@Post('avatar/:id')
   @UseInterceptors(FileInterceptor('avatar',
      {
        storage: diskStorage({
          destination: './avatars',
        filename: editFileName
        }),
        fileFilter: imageFileFilter,
      }
    )
    )
  async uploadAvatar(@Param() { id }:FindOneParams, @UploadedFile() file: Express.Multer.File) {
      this.userService.setAvatar(Number(id), `${this.SERVER_URL}${file.path}`);
  }

   @Get('avatar/:id')
  async serveAvatar(@Param() { id }:FindOneParams, @Res() res: any): Promise<any> {
    const user = 
    res.sendFile(id, { root: './avatars' });
    //(id, { root: '/home/user42/Transcendance/nestjs_back/files'});
  }

  @Delete('/:id')
  @ApiOperation({ summary: "Delete a user//Not working so far" })
  async deleteUser(@Param() { id }: FindOneParams) {
    return this.userService.deleteUser(Number(id));
  }

  @Get()
  @ApiOperation({ summary: "Get all the users" })
  async replacePost(@Req() req: RequestWithUser, @Body() userData: UpdateUserDto) {
    const { user } = req; //ask why {}
    return this.userService.changeName(user.id, userData);
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
    groups: ['infos']
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
  addAFriend(@Req() req: RequestWithUser, @Body() friend: AddFriendDto) {
    const { user } = req;
    return this.userService.addAFriend(user.id, friend.friendId);
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
  deleteAFriend(@Req() req: RequestWithUser, @Body() friend: AddFriendDto) {
    const { user } = req;
    return this.userService.deleteAFriend(user.id, friend.friendId);
  }

  @ApiOperation({ summary: "Block a user for the authenticated user" })
  @ApiParam({name: 'id', type: Number, description: 'user id'})
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
  blockAUser(@Req() req: RequestWithUser, @Body() friend: AddFriendDto) {
    const { user } = req;
    return this.userService.blockAUser(user.id, friend.friendId);
  }

  @ApiOperation({ summary: "Unblock a user for the authenticated user" })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
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
  unblockAUser(@Req() req: RequestWithUser, @Body() friend: AddFriendDto) {
    const { user } = req;
    return this.userService.unblockAUser(user.id, friend.friendId);
  }
}
