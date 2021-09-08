import {
  Body,
  Req,
  Get,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import AuthenticationService from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './interface/requestWithUser.interface';
import FortyTwoAuthenticationGuard from './guard/42Authentication.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';
import JwtTwoFactorGuard from './guard/jwtTwoFactor.guard';
import AuthInfos from './interface/authInfos.interface';
import { ApiResponse, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('authentication')
export default class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
  
  @UseGuards(FortyTwoAuthenticationGuard)
  @Get('oauth')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: '42 Oauth token invalid.'})
  async oauth(@Req() request: RequestWithUser): Promise<AuthInfos> {
    const { user } = request;
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieWithJwtToken(user.id);
    const { refreshTokenCookie, refreshTokenExpiration } = await this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: user.id,
      name: user.name,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiCookieAuth('Refresh')
  @ApiResponse({
    status: 200,
    description: 'The tokens has been successfully refreshed.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: 'Refresh token invalid.'})
  async refresh(@Req() request: RequestWithUser): Promise<AuthInfos> {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieWithJwtToken(request.user.id);
    const { refreshTokenCookie, refreshTokenExpiration } = await this.authenticationService.getCookieWithJwtRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: request.user.id,
      name: request.user.name,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  @ApiCookieAuth('Authentication')
  @ApiResponse({ status: 200, description: 'The user has been successfully authenticated.'})
  @ApiResponse({ status: 401, description: 'Authentication token invalid.'})
  authenticate(@Req() request: RequestWithUser): AuthInfos {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return {
      id: request.user.id,
      name: request.user.name,
    };
  }

  // for testing
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: 'Authenticaation token invalid.'})
  async register(@Body() registrationData: RegisterDto, @Req() req: Request): Promise<AuthInfos> {
    const fakeUser = await this.authenticationService.register(registrationData);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieWithJwtToken(fakeUser.id);
    const { refreshTokenCookie, refreshTokenExpiration } = await this.authenticationService.getCookieWithJwtRefreshToken(fakeUser.id);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: fakeUser.id,
      name: fakeUser.name,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @ApiCookieAuth('Authentication')
  @UseGuards(JwtTwoFactorGuard)
  @Post('log-out')
  @ApiResponse({ status: 200, description: 'The user has been successfully logout.'})
  @ApiResponse({ status: 401, description: 'Authenticaation token invalid.'})
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    await this.authenticationService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }
}