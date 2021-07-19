import { Body, Req, Get, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import FortyTwoAuthenticationGuard from './42Authentication.guard';
import { Request } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
  
  @UseGuards(FortyTwoAuthenticationGuard)
  @Get('oauth')
  oauth(@Req() request: RequestWithUser) {
    console.log(`req user: ${request.user}`)
    const cookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return request.res.redirect('http://localhost:3000/');
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  /* for testing
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
  */

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: Request) {
  const cookie = this.authenticationService.getCookieForLogOut();
    request.res.setHeader('Set-Cookie', cookie);
  }
}