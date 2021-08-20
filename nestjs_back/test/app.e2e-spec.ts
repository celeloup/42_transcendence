import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import * as Joi from '@hapi/joi';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import UsersModule from '../src/users/users.module';
import AuthenticationModule from '../src/authentication/authentication.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            POSTGRES_HOST: Joi.string().required(),
            POSTGRES_PORT: Joi.number().required(),
            POSTGRES_USER: Joi.string().required(),
            POSTGRES_PASSWORD: Joi.string().required(),
            POSTGRES_TEST_DB: Joi.string().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_EXPIRATION_TIME: Joi.string().required(),
            JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
            JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
          })
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_TEST_DB'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: true
          })
        }),
        UsersModule,
        AuthenticationModule
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(
      app.get(Reflector))
    );
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // test users directly registered without oauth
  const user1 = {
    name: 'fhenrion',
    email: 'fhenrion@student.42.fr',
    id42: 1
  }
  const user2 = {
    name: 'jgonfroy',
    email: 'jgonfroy@student.42.fr',
    id42: 2
  }
  const user3 = {
    name: 'cleloup',
    email: 'cleloup@student.42.fr',
    id42: 3
  }
  
  let cookies: Array<string>;

  describe('Authentication', () => {
    describe('registering users for tests', () => {
      it('user1', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user1)
          .expect({
            ...user1,
            id: 1,
            isTwoFactorAuthenticationEnabled: false
          })
          .expect(201);
      });
      it('user2', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user2)
          .expect({
            ...user2,
            id: 2,
            isTwoFactorAuthenticationEnabled: false
          })
          .expect(201);
      });

      const cookies_regex = /Authentication=.*; HttpOnly; Path=\/; SameSite=Strict; Max-Age=900,Refresh=.*; HttpOnly; Path=\/; SameSite=Strict; Max-Age=72000,Expired=; Path=\/; SameSite=Strict; Max-Age=900/;
      // cleloup is the testing user !
      it('user3 -> check the cookie', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user3)
          .expect({
            ...user3,
            id: 3,
            isTwoFactorAuthenticationEnabled: false
          })
          .expect(201)
          .expect('set-cookie', cookies_regex)
          .then((res) => {
            cookies = res.headers['set-cookie'];
          });
      })
    });

    describe('authenticate without cookie', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .expect(401)
      });
    });

    describe('authenticate with cookie', () => {
      it('should return user', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('cookie', cookies[0])
          .expect(200)
          .expect({
            ...user3,
            id: 3,
            isTwoFactorAuthenticationEnabled: false
          })
      });
    });

    describe('refresh the jwt token without cookie', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .expect(401)
      });
    });

    describe('refresh the jwt token with cookie', () => {
      it('should return user', () => {
        return request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .set('cookie', cookies[1])
          .expect(200)
          .expect({
            ...user3,
            id: 3,
            isTwoFactorAuthenticationEnabled: false
          })
      });
    });

    describe('logout', () => {
      const empty_cookies = 'Authentication=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0,Refresh=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0,Expired=; Path=\/; SameSite=Strict; Max-Age=0';
      
      it('should return empty cookies', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/log-out')
          .set('cookie', cookies[0])
          .expect(200)
          .expect('set-cookie', empty_cookies)
          .then((res) => {
            cookies = res.headers['set-cookie'];
          });
      })
    });

    describe('authenticate after logout with empty cookie', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('cookie', cookies[0])
          .expect(401)
      });
    });

  });

});
