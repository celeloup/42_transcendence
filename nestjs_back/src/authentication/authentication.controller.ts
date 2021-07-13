import { Body, Req, Get, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './requestWithUser.interface';
import LocalAuthenticationGuard from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwtAuthentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
	const user = request.user;
	user.password = undefined;
	const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
	request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
	const cookie = this.authenticationService.getCookieForLogOut();
    request.res.setHeader('Set-Cookie', cookie);
  }
}