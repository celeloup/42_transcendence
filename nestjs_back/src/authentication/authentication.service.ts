import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import User from '../users/user.entity';
import RegisterDto from './dto/RegisterDto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './interface/tokenPayload.interface';

@Injectable()
export default class AuthenticationService {
	constructor(
	  private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
	) {}

  public async findUserFrom42Id(id42: number): Promise<User> {
    return this.usersService.getBy42Id(id42);
  }

  public async getUserFromAuthenticationToken(token: string): Promise<User> {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }

  public async register(registrationData: RegisterDto): Promise<User> {
	  try {
		  return await this.usersService.create(registrationData);
	  } catch (error) {
      // should never happen -> to delete after tests
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that id already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
	  }
  }

  public getCookieWithJwtToken(userId: number, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const expire_time = this.configService.get('JWT_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${expire_time}s`
    });
    const accessTokenExpiration = new Date();
    accessTokenExpiration.setSeconds(accessTokenExpiration.getSeconds() + expire_time);
    const accessTokenCookie = `Authentication=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${accessTokenExpiration.toUTCString()}`;
    return { accessTokenCookie, accessTokenExpiration };
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0'
    ];
  }

  public async removeRefreshToken(userId: number) {
    this.usersService.removeRefreshToken(userId);
  }

  public async getCookieWithJwtRefreshToken(userId: number, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const expire_time = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${expire_time}s`
    });
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setSeconds(refreshTokenExpiration.getSeconds() + expire_time);
    const refreshTokenCookie = `Refresh=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${refreshTokenExpiration.toUTCString()}`;
    await this.usersService.setCurrentRefreshToken(token, userId);
    return { refreshTokenCookie, refreshTokenExpiration };
  }
  
}