import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import DatabaseModule from './database/database.module';
import UsersModule from './users/users.module';
import AuthenticationModule from './authentication/authentication.module';
import ExceptionsLoggerFilter from './utils/exceptionsLogger.filter';
import SocketGateway from './socket/socket.gateway';
import SocketService from './socket/socket.service';
import SocketModule from './socket/socket.module';

 
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        OAUTH_URL: Joi.string().required(),
        OAUTH_CLIENT_ID: Joi.string().required(),
        OAUTH_CLIENT_SECRET: Joi.string().required(),
        OAUTH_CALLBACK_PARAM: Joi.string().required(),
        OAUTH_CALLBACK_URL: Joi.string().required(),
        OAUTH_SCOPE: Joi.string().required(),
        OAUTH_ME_URL: Joi.string().required(),
      })
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    SocketModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    }
  ],
})
export class AppModule {}