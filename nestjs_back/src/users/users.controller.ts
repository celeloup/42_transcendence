import { Body, Controller, Put, Req, UseGuards, HttpCode } from '@nestjs/common';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiResponse } from '@nestjs/swagger';
 
@Controller('users')
export default class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User
  })
  @Put('me')
  async replacePost(@Req() req: RequestWithUser, @Body() user: UpdateUserDto): Promise<User> {
    return this.userService.changeName(req.user.id, user);
  }

  /* ajouter des amis ? modifier des stats ? */

}