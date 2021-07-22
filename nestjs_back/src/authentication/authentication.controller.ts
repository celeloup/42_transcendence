import { Body, Req, Get, Controller, HttpCode, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './requestWithUser.interface';
import FortyTwoAuthenticationGuard from './guard/42Authentication.guard';
import { Request } from 'express';
import JwtRefreshGuard from './guard/jwtRefresh.guard';
import JwtTwoFactorGuard from './guard/jwtTwoFactor.guard';

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
    const expiredCookie = this.authenticationService.getExpiredCookie();
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie, expiredCookie]);
    return request.res.redirect('http://localhost:3000/');
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(request.user.id);
    const expiredCookie = this.authenticationService.getExpiredCookie();
    request.res.setHeader('Set-Cookie', [accessTokenCookie, expiredCookie]);
    return request.user;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return request.user;
  }

  // for testing
  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Req() req: Request) {
    const fakeUser = await this.authenticationService.register(registrationData);
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(fakeUser.id);
    const refreshTokenCookie = await this.authenticationService.getCookieWithJwtRefreshToken(fakeUser.id);
    const expiredCookie = this.authenticationService.getExpiredCookie();
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie, expiredCookie]);
    return fakeUser;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    await this.authenticationService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }
}