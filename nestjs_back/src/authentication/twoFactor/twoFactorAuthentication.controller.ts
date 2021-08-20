import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Req,
  HttpCode,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import TwoFactorAuthenticationService from './twoFactorAuthentication.service';
import JwtAuthenticationGuard from '../guard/jwtAuthentication.guard';
import RequestWithUser from '../requestWithUser.interface';
import UsersService from '../../users/users.service';
import TwoFactorAuthenticationCodeDto from './dto/twoFactorAuthenticationCode.dto';
import AuthenticationService from '../authentication.service';
   
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export default class TwoFactorAuthenticationController {
	constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService
	) {}
   
	@Post('generate')
	@UseGuards(JwtAuthenticationGuard)
	async register(@Req() request: RequestWithUser) {
	  const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
	  return this.twoFactorAuthenticationService.pipeQrCodeStream(otpauthUrl);
  }
  
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const {user} = request;
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieWithJwtToken(user.id, true);
    const { refreshTokenCookie, refreshTokenExpiration } = await this.authenticationService.getCookieWithJwtRefreshToken(user.id, true);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      id: user.id,
      name: user.name,
      accessTokenExpiration,
      refreshTokenExpiration
    };
  }
}