import { Body, Controller, Put, Req, Get, UseGuards, Param, Delete } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import AddFriendDto from './dto/addFriend.dto';

@ApiTags('users') 
@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @ApiOperation({summary: "Update the user"})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User
  })
  @Put('me')
  async replacePost(@Req() req: RequestWithUser, @Body() user: UpdateUserDto): Promise<User> {
    return this.userService.changeName(req.user.id, user);
  }

  @Get()
  @ApiOperation({summary: "Get all the users"})
  GetAllUsers(){
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({summary: "Get user by id"})
  getById(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @Get('matches/:id')
  @ApiOperation({summary: "Get matches by id"})
  getMatchesByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getMatchesByUserId(Number(id));
  }

  @Get('channels/:id')
  getChannelsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getChannelsByUserId(Number(id));
  }

  @Get('achievements/:id')
  @ApiOperation({summary: "Get achievements by id"})
  getAchievementsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAchievementsByUserId(Number(id));
  } 

  @Get('friends/:id')
  @ApiOperation({summary: "Get friends by id"})
  getFriendsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getFriendsByUserId(Number(id));
  } 

  @Get('infos/:id')
  getAllInfosByUserId(@Param() { id }:FindOneParams) {
    return this.userService.getAllInfosByUserId(Number(id));
  }

  @Put('friend/:id')
  @ApiOperation({summary: "Add a fiend to user by id"})
  addAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.addAFriend(Number(id), friend.friendId);
  }

  @Delete('friend/:id')
  @ApiOperation({summary: "Delete a fiend to user by id"})
  deleteAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.deleteAFriend(Number(id), friend.friendId);
  }

  @Put('block/:id')
  blockAUser(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.blockAUser(Number(id), friend.friendId);
  }

  @Delete('block/:id')
  unblockAUser(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.unblockAUser(Number(id), friend.friendId);
  }
}