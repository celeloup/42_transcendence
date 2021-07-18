import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
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
  
  /*
	public async register(registrationData: RegisterDto) {
	  const hashedPassword = await bcrypt.hash(registrationData.password, 10);
	  try {
		  const createdUser = await this.usersService.create({
		    ...registrationData,
		    password: hashedPassword
		  });
		  createdUser.password = undefined;
		  return createdUser;
	  } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	}
  
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

   
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
  */

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    const expire_time = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expire_time}`;
  }

  public getCookieForLogOut() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
  
}