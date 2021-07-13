import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import TokenPayload from './tokenPayload.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UsersService);
    validate(payload: TokenPayload): Promise<import("../users/user.entity").default>;
}
export {};
