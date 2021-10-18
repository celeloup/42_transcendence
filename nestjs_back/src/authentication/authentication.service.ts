import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import User from '../users/user.entity';
import RegisterDto from './dto/RegisterDto';
import { PostgresErrorCode } from '../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './interface/tokenPayload.interface';
import jwt from './interface/jwt.interface';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthenticationService {
	constructor(
	  private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
	) {}

  public async findUserFrom42Id(id42: number): Promise<User> {
    return this.usersService.getBy42Id(id42);
  }

  public async getUserFromAuthenticationToken(token: string): Promise<User> {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET')
    });
    if (payload.userId) {
      return this.usersService.getById(payload.userId);
    }
  }

  async getPrivateInfos(user: User) {
    return await this.usersService.getPrivateInfosById(user.id);
  }

  async getUserFromSocket(socket: Socket) {
    let authenticationToken: string;
    const cookie = socket.handshake.headers.cookie;
    const bearer = socket.handshake.headers.authorization;
    if (cookie) {
      authenticationToken = parse(cookie).Authentication;
    } else if (bearer) {
      authenticationToken = bearer.split(" ")[1];
    } else {
      return null;
    }
    const user = await this.getUserFromAuthenticationToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  public async register(registrationData: RegisterDto): Promise<User> {
	  try {
		  return await this.usersService.create(registrationData);
	  } catch (error) {
      // should never happen -> to delete after tests
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that id or name or email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
	  }
  }

  public getJwtToken(userId: number, isSecondFactorAuthenticated = false): jwt {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const expire_time = this.configService.get('JWT_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${expire_time}s`
    });
    return { token, expire_time };
  }

  public getCookieForJwtToken(jwt: jwt) {
    const accessTokenExpiration = new Date();
    accessTokenExpiration.setSeconds(accessTokenExpiration.getSeconds() + jwt.expire_time);
    const accessTokenCookie = `Authentication=${jwt.token}; HttpOnly; Path=/; SameSite=Strict; Expires=${accessTokenExpiration.toUTCString()}`;
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

  public async getJwtRefreshToken(userId: number, isSecondFactorAuthenticated = false): Promise<jwt> {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const expire_time = this.configService.get('JWT_REFRESH_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${expire_time}s`
    });
    await this.usersService.setCurrentRefreshToken(token, userId);
    return { token, expire_time };
  }

  public getCookieForJwtRefreshToken(jwt: jwt) {
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setSeconds(refreshTokenExpiration.getSeconds() + jwt.expire_time);
    const refreshTokenCookie = `Refresh=${jwt.token}; HttpOnly; Path=/; SameSite=Strict; Expires=${refreshTokenExpiration.toUTCString()}`;
    return { refreshTokenCookie, refreshTokenExpiration };
  }
  
}