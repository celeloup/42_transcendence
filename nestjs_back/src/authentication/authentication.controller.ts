import { Body, Req, Get, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import FortyTwoAuthenticationGuard from './42Authentication.guard';
import { Request } from 'express';
import JwtRefreshGuard from './jwtRefresh.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
  
  @UseGuards(FortyTwoAuthenticationGuard)
  @Get('oauth')
  async oauth(@Req() request: RequestWithUser) {
    const {user} = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(user.id);
    const refreshTokenCookie = await this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return request.res.redirect('http://localhost:3000/');
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  // for testing
  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Req() req: Request) {
    const fakeUser = await this.authenticationService.register(registrationData);
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(fakeUser.id);
    const refreshTokenCookie = await this.authenticationService.getCookieWithJwtRefreshToken(fakeUser.id);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return fakeUser;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.authenticationService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }
}