import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import * as Joi from '@hapi/joi';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

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

  const userData = {
    name: "bob",
    email: "bob@test.com",
    password: "iambobybob"
  }

  describe('Authentication', () => {

    describe('registering with valid data', () => {
      it('should respond with the data of the user without the password', () => {
        const expectedData = {
          ...userData
        }
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(userData)
          .expect(201)
          .expect(expectedData);
      })
    });

    describe('and incomplete data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send({
            name: 'bob'
          })
          .expect(400)
      })
    });

    describe('and invalid email', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send({
            name: userData.name,
            password: userData.password,
            email: 'notvalidemail'
          })
          .expect(400)
      })
    });

    describe('and to short password', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send({
            name: userData.name,
            password: 'i',
            email: userData.email
          })
          .expect(400)
      })
    });

    describe('and email already exist', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(userData)
          .expect(400)
      })
    });

    describe('login with wrong credentials', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/log-in')
          .send({
            email: userData.email,
            password: 'wrong'
          })
          .expect(400)
      })
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/log-in')
          .send({
            email: 'not@exist.com',
            password: userData.password
          })
          .expect(400)
      })
    });

    let cookie: string;
    describe('login with right credentials', () => {
      it('should return user and cookie', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/log-in')
          .send({
            email: userData.email,
            password: userData.password
          })
          .expect(200)
          .expect({
            email: userData.email,
            name: userData.name
          })
          .expect('set-cookie', /Authentication=.*; HttpOnly; Path=\/; Max-Age=72000/)
          .then((res) => {
            cookie = res.headers['set-cookie'][0];
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
          .set('cookie', cookie)
          .expect(200)
          .expect({
            email: userData.email,
            name: userData.name
          })
      });
    });

    describe('logout', () => {
      it('should return an empty cookie', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/log-out')
          .set('cookie', cookie)
          .expect(200)
          .expect('set-cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0')
          .then((res) => {
            cookie = res.headers['set-cookie'][0];
          });
      })
    });

    describe('authenticate with logout empty cookie', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('cookie', cookie)
          .expect(401)
      });
    });

  });
  
});
