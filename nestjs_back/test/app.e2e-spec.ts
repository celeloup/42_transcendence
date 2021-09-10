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
import io from 'socket.io-client';
import SocketModule from '../src/socket/socket.module';

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
        AuthenticationModule,
        SocketModule
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
    await app.listen(9090);
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
  let bearers: Array<string>;
  const cookies_regex = /Authentication=.*; HttpOnly; Path=\/; SameSite=Strict; Expires=.*,Refresh=.*; HttpOnly; Path=\/; SameSite=Strict; Expires=.*/;

  describe('Authentication', () => {
    describe('registering users for tests', () => {
      it('user1', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user1)
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 1,
              name: user1.name,
              authentication: expect.any(String),
              refresh: expect.any(String),
              accessTokenExpiration: expect.any(String),
              refreshTokenExpiration: expect.any(String)
            });
            expect(res.body.authentication).toHaveLength(191);
            expect(res.body.refresh).toHaveLength(191);
            expect(res.body.accessTokenExpiration).toHaveLength(24);
            expect(res.body.refreshTokenExpiration).toHaveLength(24);
          })
          .expect(201)
          .expect('set-cookie', cookies_regex);
      });
      it('user2', () => {
        return request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user2)
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 2,
              name: user2.name,
              authentication: expect.any(String),
              refresh: expect.any(String),
              accessTokenExpiration: expect.any(String),
              refreshTokenExpiration: expect.any(String)
            });
            expect(res.body.authentication).toHaveLength(191);
            expect(res.body.refresh).toHaveLength(191);
            expect(res.body.accessTokenExpiration).toHaveLength(24);
            expect(res.body.refreshTokenExpiration).toHaveLength(24);
          })
          .expect(201)
          .expect('set-cookie', cookies_regex);
      });

      // cleloup is the testing user !
      it('user3 -> get the cookie and bearer', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(user3)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              name: user3.name,
              authentication: expect.any(String),
              refresh: expect.any(String),
              accessTokenExpiration: expect.any(String),
              refreshTokenExpiration: expect.any(String)
            });
            expect(res.body.authentication).toHaveLength(191);
            expect(res.body.refresh).toHaveLength(191);
            expect(res.body.accessTokenExpiration).toHaveLength(24);
            expect(res.body.refreshTokenExpiration).toHaveLength(24);
          })
          .expect(201)
          .expect('set-cookie', cookies_regex);
        cookies = response.headers['set-cookie'];
        bearers = [response.body.authentication, response.body.refresh];
      })
    });

    describe('authenticate without cookie or bearer', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .expect(401);
      });
    });

    describe('authenticate with cookie', () => {
      it('should return user', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('cookie', cookies[0])
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 3,
              name: user3.name,
              email: user3.email,
              id42: user3.id42,
              isTwoFactorAuthenticationEnabled: false
            });
          })
          .expect(200);
      });
    });

    describe('authenticate with bearer', () => {
      it('should return user', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('authorization', `bearer ${bearers[0]}`)
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 3,
              name: user3.name,
              email: user3.email,
              id42: user3.id42,
              isTwoFactorAuthenticationEnabled: false
            });
          })
          .expect(200);
      });
    });

    describe('refresh the jwt token without cookie or bearer', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .expect(401);
      });
    });

    describe('refresh the jwt token with cookie', () => {
      it('should return auth infos', () => {
        return request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .set('cookie', cookies[1])
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              name: user3.name,
              authentication: expect.any(String),
              refresh: expect.any(String),
              accessTokenExpiration: expect.any(String),
              refreshTokenExpiration: expect.any(String)
            });
            expect(res.body.authentication).toHaveLength(191);
            expect(res.body.refresh).toHaveLength(191);
            expect(res.body.accessTokenExpiration).toHaveLength(24);
            expect(res.body.refreshTokenExpiration).toHaveLength(24);
          })
          .expect(200);
      });
    });

    describe('refresh the jwt token with bearer', () => {
      it('should return auth infos', () => {
        return request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .set('authorization', `bearer ${bearers[1]}`)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              name: user3.name,
              authentication: expect.any(String),
              refresh: expect.any(String),
              accessTokenExpiration: expect.any(String),
              refreshTokenExpiration: expect.any(String)
            });
            expect(res.body.authentication).toHaveLength(191);
            expect(res.body.refresh).toHaveLength(191);
            expect(res.body.accessTokenExpiration).toHaveLength(24);
            expect(res.body.refreshTokenExpiration).toHaveLength(24);
          })
          .expect(200);
      });
    });

    describe('websocket test gateway with cookie', () => {
      it('should connect and return the username', async () => {
        const URL = "http://localhost:9090/test"
        const CONFIG = {
          extraHeaders: {
            cookie: cookies[0]
          },
          autoConnect: false
        }
        const socket = io(URL, CONFIG);
        try {
          const message = await new Promise((resolve, reject) => {
            socket.on("connect", () => {
              socket.emit("whoami");
            });
  
            socket.on("connect_error", (err) => {
              socket.close();
              reject(err);
            });
  
            socket.on('receive_message', (recievedMessage: string) => {
              socket.disconnect();
              socket.close();
              resolve(recievedMessage);
            });

            socket.connect();
          });
          expect(message).toBe(user3.name);
        } catch (err) {
          throw err;
        }
      });
    });

    describe('websocket test gateway with bearer', () => {
      it('should connect and return the username', async () => {
        const URL = "http://localhost:9090/test"
        const CONFIG = {
          extraHeaders: {
            authorization: `bearer ${bearers[0]}`
          },
          autoConnect: false
        }
        const socket = io(URL, CONFIG);
        try {
          const message = await new Promise((resolve, reject) => {
            socket.on("connect", () => {
              socket.emit("whoami");
            });
  
            socket.on("connect_error", (err) => {
              socket.close();
              reject(err);
            });
  
            socket.on('receive_message', (recievedMessage: string) => {
              socket.disconnect();
              socket.close();
              resolve(recievedMessage);
            });

            socket.connect();
          });
          expect(message).toBe(user3.name);
        } catch (err) {
          throw err;
        }
      });
    });

    describe('websocket test gateway without cookie or bearer', () => {
      it('should connect and return connector username', async () => {
        const URL = "http://localhost:9090/test"
        const CONFIG = {
          autoConnect: false
        }
        const socket = io(URL, CONFIG);
        try {
          const message = await new Promise((resolve, reject) => {
            socket.on("connect", () => {
              socket.emit("whoami");
            });
  
            socket.on("connect_error", (err) => {
              socket.close();
              reject(err);
            });
  
            socket.on('receive_message', (recievedMessage: string) => {
              socket.disconnect();
              socket.close();
              resolve(recievedMessage);
            });

            socket.connect();
          });
          expect(message).toBe("connector");
        } catch (err) {
          throw err;
        }
      });
    });

    describe('channel test gateway with cookie', () => {
      it('should connect and return the message', (done) => {
        const URL = "http://localhost:9090/channel"
        const CONFIG = {
          extraHeaders: {
            cookie: cookies[0]
          }
        }
        const socket = io(URL, CONFIG);

        socket.on("connect", () => {
          socket.emit('send_message', { content: 'Youhou', recipient: 'toto'});
        });
      });
    });
    describe('logout', () => {
      const empty_cookies = 'Authentication=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0,Refresh=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0';
      
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
