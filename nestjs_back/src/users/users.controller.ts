import { Body, Controller, Put, Req, Get, UseGuards, Param, Delete } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import AddFriendDto from './dto/addFriend.dto';
 
@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Put('me')
  async replacePost(@Req() req: RequestWithUser, @Body() user: UpdateUserDto) {
    return this.userService.changeName(req.user.id, user);
  }

  @Get(':id')
  getById(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @Get('matches/:id')
  getMatchesByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getMatchesByUserId(Number(id));
  }

  @Get('achievements/:id')
  getFriendsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAchievementsByUserId(Number(id));
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