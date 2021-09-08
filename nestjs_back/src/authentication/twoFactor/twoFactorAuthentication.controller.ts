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
import { ApiResponse, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

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
  @ApiCookieAuth('Authentication')
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
  @HttpCode(200)
  @ApiCookieAuth('Authentication')
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
  @HttpCode(200)
  @ApiCookieAuth('Authentication')
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