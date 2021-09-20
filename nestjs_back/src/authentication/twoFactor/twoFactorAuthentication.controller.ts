import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import TwoFactorAuthenticationService from './twoFactorAuthentication.service';
import JwtAuthenticationGuard from '../guard/jwtAuthentication.guard';
import RequestWithUser from '../interface/requestWithUser.interface';
import UsersService from '../../users/users.service';
import TwoFactorAuthenticationCodeDto from './dto/twoFactorAuthenticationCode.dto';
import AuthenticationService from '../authentication.service';
import AuthInfos from '../interface/authInfos.interface';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('2 Factors authentication')
@Controller('2fa')
export default class TwoFactorAuthenticationController {
	constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService
	) {}

  @UseGuards(JwtAuthenticationGuard)
	@Post('generate')
  @ApiOperation({summary: "Return the 2fa configuration QRcode"})
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 201,
    description: 'Qrcode code generation successful (return as a base64 string).',
    type: String
  })
  @ApiResponse({ status: 401, description: 'Authentication token invalid.'})
	async register(@Req() request: RequestWithUser): Promise<string> {
	  const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
	  return this.twoFactorAuthenticationService.pipeQrCodeStream(otpauthUrl);
  }
  
  @UseGuards(JwtAuthenticationGuard)
  @Post('turn-on')
  @ApiOperation({summary: "Enable the 2fa with the 2fa code"})
  @HttpCode(200)
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: '2 factor authentication successfully enabled.',
  })
  @ApiResponse({ status: 401, description: 'Authentication token invalid or Wrong authentication code.'})
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

  @UseGuards(JwtAuthenticationGuard)
  @Post('authenticate')
  @ApiOperation({summary: "return user associated with the authentication token"})
  @HttpCode(200)
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: '2 factor authentication successfully enabled.',
    type: AuthInfos
  })
  @ApiResponse({ status: 401, description: 'Authentication token invalid or Wrong authentication code.'})
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
  ): Promise<AuthInfos> {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const { user } = request;
    const accessJwt = this.authenticationService.getJwtToken(user.id, true);
    const { accessTokenCookie, accessTokenExpiration } = this.authenticationService.getCookieForJwtToken(accessJwt);
    const refreshJwt = await this.authenticationService.getJwtRefreshToken(user.id, true);
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
}