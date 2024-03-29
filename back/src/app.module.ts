import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import DatabaseModule from './database/database.module';
import UsersModule from './users/users.module';
import MatchesModule from './matches/matches.module'
import AuthenticationModule from './authentication/authentication.module';
import ExceptionsLoggerFilter from './utils/exceptionsLogger.filter';
import ChannelModule from './channel/channel.module';
import AchievementsModule from './achievements/achievements.module';
import GameModule from './game/game.module';
import { MulterModule } from '@nestjs/platform-express';
import muteObjModule from './channel/muteObj.module';

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
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        OAUTH_URL: Joi.string().required(),
        OAUTH_CLIENT_ID: Joi.string().required(),
        OAUTH_CLIENT_SECRET: Joi.string().required(),
        OAUTH_CALLBACK_URL: Joi.string().required(),
        OAUTH_SCOPE: Joi.string().required(),
        OAUTH_ME_URL: Joi.string().required(),
      })
    }),
    DatabaseModule,
    UsersModule,
    MatchesModule,
    AchievementsModule,
    ChannelModule,
    muteObjModule,
    AuthenticationModule,
    GameModule,
    MulterModule.registerAsync({
      useFactory: () => ({dest: './files',})
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    }
  ],
})
export class AppModule { }
