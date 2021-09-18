import { Body, Controller, Put, Req, Get, UseGuards, Param, Delete } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import AddFriendDto from './dto/addFriend.dto';

@ApiTags('users') 
@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
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
  GetAllUsers(){
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getById(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @Get('matches/:id')
  getMatchesByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getMatchesByUserId(Number(id));
  }

  @Get('channels/:id')
  getChannelsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getChannelsByUserId(Number(id));
  }

  @Get('achievements/:id')
  getAchievementsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAchievementsByUserId(Number(id));
  } 

  @Get('friends/:id')
  getFriendsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getFriendsByUserId(Number(id));
  } 

  @Get('infos/:id')
  getAllInfosByUserId(@Param() { id }:FindOneParams) {
    return this.userService.getAllInfosByUserId(Number(id));
  }

  @Put('friend/:id')
  addAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.addAFriend(Number(id), friend);
  }

  @Delete('friend/:id')
  deleteAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.deleteAFriend(Number(id), friend);
  }
  /* ajouter des amis ? modifier des stats ? */

}