import {
  Body,
  Req,
  Get,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UnauthorizedException,
  SerializeOptions,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request } from 'express';
import AuthenticationService from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './interface/requestWithUser.interface';
import FortyTwoAuthenticationGuard from './guard/42Authentication.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';
import JwtTwoFactorGuard from './guard/jwtTwoFactor.guard';
import AuthInfos from './interface/authInfos.interface';
import { ApiResponse, ApiBearerAuth, ApiTags, ApiCookieAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import myUserInfos from './interface/myUserInfos.interface';
import LoginDto from './dto/LoginDto';

@ApiTags('authentication')
@Controller('authentication')
export default class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
  
  @UseGuards(FortyTwoAuthenticationGuard)
  @Get('oauth')
  @ApiOperation({summary: "Create and authenticate user with 42 oauth code"})
  @ApiQuery({name: 'code', type: String, description: '42 oauth code'})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: '42 Oauth token invalid.'})
  @ApiResponse({ status: 403, description: 'The user is banned.'})
  async oauth(@Req() request: RequestWithUser): Promise<AuthInfos> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.site_banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN);
    }
    const accessJwt = this.authenticationService.getJwtToken(user.id);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieForJwtToken(accessJwt);
    const refreshJwt = await this.authenticationService.getJwtRefreshToken(user.id);
    const { refreshTokenCookie, refreshTokenExpiration } = this.authenticationService.getCookieForJwtRefreshToken(refreshJwt);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: user.id,
      name: user.name,
      authentication: accessJwt.token,
      refresh: refreshJwt.token,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiOperation({summary: "Refresh the tokens"})
  @ApiBearerAuth('bearer-refresh')
  @ApiCookieAuth('cookie-refresh')
  @ApiResponse({
    status: 200,
    description: 'The tokens has been successfully refreshed.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: 'Refresh token invalid.'})
  @ApiResponse({ status: 403, description: 'The user is banned.'})
  async refresh(@Req() request: RequestWithUser): Promise<AuthInfos> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.site_banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN);
    }
    const accessJwt = this.authenticationService.getJwtToken(user.id);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieForJwtToken(accessJwt);
    const refreshJwt = await this.authenticationService.getJwtRefreshToken(user.id);
    const { refreshTokenCookie, refreshTokenExpiration } = this.authenticationService.getCookieForJwtRefreshToken(refreshJwt);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: user.id,
      name: user.name,
      authentication: accessJwt.token,
      refresh: refreshJwt.token,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @ApiOperation({summary: "return the private infos of the authenticated user"})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated',
    type: myUserInfos
  })
  @ApiResponse({ status: 401, description: 'Authentication token invalid.'})
  @ApiResponse({ status: 403, description: 'The user is banned.'})
  @SerializeOptions({
    groups: ['me']
  })
  @UseGuards(JwtTwoFactorGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.site_banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN);
    }
    return await this.authenticationService.getPrivateInfos(user);
  }

  // for testing
  @Post('register')
  @ApiOperation({summary: "register user without 42 oauth for testing purpose"})
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: AuthInfos
  })
  async register(@Body() registrationData: RegisterDto, @Req() req: Request): Promise<AuthInfos> {
    const fakeUser = await this.authenticationService.register(registrationData);
    const accessJwt = this.authenticationService.getJwtToken(fakeUser.id);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieForJwtToken(accessJwt);
    const refreshJwt = await this.authenticationService.getJwtRefreshToken(fakeUser.id);
    const { refreshTokenCookie, refreshTokenExpiration } = this.authenticationService.getCookieForJwtRefreshToken(refreshJwt);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: fakeUser.id,
      name: fakeUser.name,
      authentication: accessJwt.token,
      refresh: refreshJwt.token,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  // for testing
  @Post('log-in')
  @ApiOperation({summary: "login user without 42 oauth for testing purpose"})
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged.',
    type: AuthInfos
  })
  @ApiResponse({ status: 404, description: 'User not found with this 42id.'})
  @ApiResponse({ status: 403, description: 'The user is banned.'})
  async login(@Body() loginData: LoginDto, @Req() req: Request): Promise<AuthInfos> {
    const fakeUser = await this.authenticationService.findUserFrom42Id(loginData.id42)
    if (!fakeUser) {
      throw new HttpException('User not found with this 42id', HttpStatus.NOT_FOUND);
    }
    if (fakeUser.site_banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN);
    }
    const accessJwt = this.authenticationService.getJwtToken(fakeUser.id);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieForJwtToken(accessJwt);
    const refreshJwt = await this.authenticationService.getJwtRefreshToken(fakeUser.id);
    const { refreshTokenCookie, refreshTokenExpiration } = this.authenticationService.getCookieForJwtRefreshToken(refreshJwt);
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: fakeUser.id,
      name: fakeUser.name,
      authentication: accessJwt.token,
      refresh: refreshJwt.token,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('log-out')
  @ApiOperation({summary: "delete the token cookies and delete the refresh token from database"})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({ status: 200, description: 'The user has been successfully logout.'})
  @ApiResponse({ status: 401, description: 'Authentication token invalid.'})
  @ApiResponse({ status: 403, description: 'The user is banned.'})
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.site_banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN);
    }
    await this.authenticationService.removeRefreshToken(user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
  }
}