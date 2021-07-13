"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const postgresErrorCodes_enum_1 = require("../database/postgresErrorCodes.enum");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthenticationService = class AuthenticationService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registrationData) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdUser.password = undefined;
            return createdUser;
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.code) === postgresErrorCodes_enum_1.PostgresErrorCode.UniqueViolation) {
                throw new common_1.HttpException('User with that email already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAuthenticatedUser(email, plainTextPassword) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        }
        catch (error) {
            throw new common_1.HttpException('Wrong credentials provided', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPassword(plainTextPassword, hashedPassword) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new common_1.HttpException('Wrong credentials provided', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    getCookieWithJwtToken(userId) {
        const payload = { userId };
        const token = this.jwtService.sign(payload);
        const expire_time = this.configService.get('JWT_EXPIRATION_TIME');
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expire_time}`;
    }
    getCookieForLogOut() {
        return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
    }
};
AuthenticationService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map