"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const authentication_module_1 = require("./authentication/authentication.module");
const Joi = require("@hapi/joi");
const exceptionsLogger_filter_1 = require("./utils/exceptionsLogger.filter");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                validationSchema: Joi.object({
                    POSTGRES_HOST: Joi.string().required(),
                    POSTGRES_PORT: Joi.number().required(),
                    POSTGRES_USER: Joi.string().required(),
                    POSTGRES_PASSWORD: Joi.string().required(),
                    POSTGRES_DB: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_EXPIRATION_TIME: Joi.string().required(),
                })
            }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            authentication_module_1.AuthenticationModule
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: exceptionsLogger_filter_1.ExceptionsLoggerFilter,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map