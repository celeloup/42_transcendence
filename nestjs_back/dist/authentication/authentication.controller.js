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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const RegisterDto_1 = require("./dto/RegisterDto");
const localAuthentication_guard_1 = require("./localAuthentication.guard");
const jwtAuthentication_guard_1 = require("./jwtAuthentication.guard");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async register(registrationData) {
        return this.authenticationService.register(registrationData);
    }
    authenticate(request) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
    async logIn(request) {
        const user = request.user;
        user.password = undefined;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        request.res.setHeader('Set-Cookie', cookie);
        return user;
    }
    async logOut(request) {
        const cookie = this.authenticationService.getCookieForLogOut();
        request.res.setHeader('Set-Cookie', cookie);
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto_1.default]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    common_1.UseGuards(jwtAuthentication_guard_1.default),
    common_1.Get(),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "authenticate", null);
__decorate([
    common_1.HttpCode(200),
    common_1.UseGuards(localAuthentication_guard_1.default),
    common_1.Post('log-in'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logIn", null);
__decorate([
    common_1.HttpCode(200),
    common_1.UseGuards(jwtAuthentication_guard_1.default),
    common_1.Post('log-out'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "logOut", null);
AuthenticationController = __decorate([
    common_1.Controller('authentication'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map