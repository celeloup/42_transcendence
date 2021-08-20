import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import UsersService from './users.service';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
 
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

  /* ajouter des amis ? modifier des stats ? */

}