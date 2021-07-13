import { UsersService } from '../users/users.service';
import RegisterDto from './dto/RegisterDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthenticationService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registrationData: RegisterDto): Promise<import("../users/user.entity").default>;
    getAuthenticatedUser(email: string, plainTextPassword: string): Promise<import("../users/user.entity").default>;
    private verifyPassword;
    getCookieWithJwtToken(userId: number): string;
    getCookieForLogOut(): string;
}
