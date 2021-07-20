import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/RegisterDto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';

@Injectable()
export class AuthenticationService {
	constructor(
	  private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
	) {}

  public async findUserFrom42Id(id42: number) {
    return this.usersService.getBy42Id(id42);
  }

  public async register(registrationData: RegisterDto) {
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

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const expire_time = this.configService.get('JWT_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${expire_time}s`
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expire_time}`;
  }

  public getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  public async removeRefreshToken(userId: number) {
    this.usersService.removeRefreshToken(userId);
  }

  public async getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const expire_time = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${expire_time}s`
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expire_time}`;
    await this.usersService.setCurrentRefreshToken(token, userId);
    return cookie;
  }
  
}