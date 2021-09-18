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
import ChannelModule from '../src/channel/channel.module';
import Message from "../src/channel/message.entity";

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
            JWT_REFRESH_SECRET: Joi.string().required(),
            JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
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
        SocketModule,
        ChannelModule
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
  const fhenrion = {
    name: 'fhenrion',
    email: 'fhenrion@student.42.fr',
    id42: 1
  }
  let fhenrionCookies: Array<string>;
  let fhenrionBearers: Array<string>;
  const jgonfroy = {
    name: 'jgonfroy',
    email: 'jgonfroy@student.42.fr',
    id42: 2
  }
  let jgonfroyCookies: Array<string>;
  let jgonfroyBearers: Array<string>;
  const cleloup = {
    name: 'cleloup',
    email: 'cleloup@student.42.fr',
    id42: 3
  }
  let cleloupCookies: Array<string>;
  let cleloupBearers: Array<string>;
  const amartin = {
    name: 'amartin',
    email: 'amartin@student.42.fr',
    id42: 4
  }
  let amartinCookies: Array<string>;
  let amartinBearers: Array<string>;

  const cookies_regex = /Authentication=.*; HttpOnly; Path=\/; SameSite=Strict; Expires=.*,Refresh=.*; HttpOnly; Path=\/; SameSite=Strict; Expires=.*/;
  describe('Authentication', () => {
    describe('registering users for tests', () => {
      it('fhenrion', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(fhenrion)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 1,
              name: fhenrion.name,
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
        fhenrionCookies = response.headers['set-cookie'];
        fhenrionBearers = [response.body.authentication, response.body.refresh];
      });

      it('jgonfroy', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(jgonfroy)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 2,
              name: jgonfroy.name,
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
        jgonfroyCookies = response.headers['set-cookie'];
        jgonfroyBearers = [response.body.authentication, response.body.refresh];
      });

      it('cleloup', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(cleloup)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              name: cleloup.name,
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
        cleloupCookies = response.headers['set-cookie'];
        cleloupBearers = [response.body.authentication, response.body.refresh];
      });

      it('amartin', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/authentication/register')
          .send(amartin)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 4,
              name: amartin.name,
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
        amartinCookies = response.headers['set-cookie'];
        amartinBearers = [response.body.authentication, response.body.refresh];
      });
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
          .set('cookie', cleloupCookies[0])
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 3,
              name: cleloup.name,
              email: cleloup.email,
              id42: cleloup.id42,
              isTwoFactorAuthenticationEnabled: false,
              admin: null,
              defeats: 0,
              friends: null,
              points: 0,
              victories: 0
            });
          })
          .expect(200);
      });
    });

    describe('authenticate with bearer', () => {
      it('should return user', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('authorization', `bearer ${fhenrionBearers[0]}`)
          .expect((res) =>  {
            expect(res.body).toEqual({
              id: 1,
              name: fhenrion.name,
              email: fhenrion.email,
              id42: fhenrion.id42,
              isTwoFactorAuthenticationEnabled: false,
              admin: null,
              defeats: 0,
              friends: null,
              points: 0,
              victories: 0
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
      it('should return auth infos', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .set('cookie', cleloupCookies[1])
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              name: cleloup.name,
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
          .expect(200)
          .expect('set-cookie', cookies_regex);
        cleloupCookies = response.headers['set-cookie'];
        cleloupBearers = [response.body.authentication, response.body.refresh];
      });
    });

    describe('refresh the jwt token with bearer', () => {
      it('should return auth infos', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/authentication/refresh')
          .set('authorization', `bearer ${jgonfroyBearers[1]}`)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 2,
              name: jgonfroy.name,
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
          .expect(200)
          .expect('set-cookie', cookies_regex);
        jgonfroyCookies = response.headers['set-cookie'];
        jgonfroyBearers = [response.body.authentication, response.body.refresh];
      });
    });

    /*
    describe('websocket test gateway with cookie', () => {
      it('should connect and return the username', async () => {
        const URL = "http://localhost:9090/test"
        const CONFIG = {
          extraHeaders: {
            cookie: cleloupCookies[0]
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
              socket.close();
              resolve(recievedMessage);
            });

            socket.connect();
          });
          expect(message).toBe(cleloup.name);
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
            authorization: `bearer ${amartinBearers[0]}`
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
              socket.close();
              resolve(recievedMessage);
            });

            socket.connect();
          });
          expect(message).toBe(amartin.name);
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
    */

    // routes for creating channels
    // keep them for testing
    describe('Channel creation', () => {
      it('should create and return the channel', () => {
        return request(app.getHttpServer())
        .post('/api/channel/')
        .set('authorization', `bearer ${jgonfroyBearers[1]}`)
        .send({
          name: 'transcendance team',
          owner_id: jgonfroy.id42
        })
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            name: 'transcendance team',
            admin: [],
            members: [],
            owner: expect.any(Object),
            password: null,
            private: false
          });
        })
        .expect(201);
      });
    });

    describe('get a channel', () => {
      it('should return the channel', () => {
        return request(app.getHttpServer())
        .get('/api/channel/1')
        .set('authorization', `bearer ${jgonfroyBearers[1]}`)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            name: 'transcendance team',
            password: null,
            private: false
          });
        })
        .expect(200);
      });
    });
    
    // test with 3 users
    // 1) two users send messages
    // 2) one user get messages

    /*
    describe('channel test gateway users PM', () => {
      it('cleloup should receive coucou from fhenrion', async () => {
        const URL = "http://localhost:9090/channel"
        const sockets = [
          io(URL, {
            autoConnect: false,
            extraHeaders: {
              authorization: '',
              cookie: ''
            },
          }),
          io(URL, {
            autoConnect: false,
            extraHeaders: {
              authorization: '',
              cookie: ''
            },
          })
        ];
        // extraHeaders need to be set manually because of a weird bug of socket.io-client with multiple clients
        sockets[0].io.opts.extraHeaders.cookie = ''
        sockets[0].io.opts.extraHeaders.authorization = `bearer ${fhenrionBearers[0]}`
        sockets[1].io.opts.extraHeaders.cookie = cleloupCookies[0]
        sockets[1].io.opts.extraHeaders.authorization = ''
        try {
          const messages = await new Promise(async (resolve, reject) => {
            sockets[0].on("connect", () => {
              sockets[0].emit('send_message', { content: 'coucou', recipient: {name: 'transcendance team'} });
              sockets[0].close();
            });

            sockets[1].on("connect", () => {
              sockets[1].emit('request_messages', 'cleloup');
            });

            sockets[1].on("messagesByChannel", (receivedMessages: Message[]) => {
              sockets[1].close();
              resolve(receivedMessages);
            });
            
            sockets[1].on("connect_error", (err) => {
              if (sockets[0].connected) {
                sockets[0].close();
              }
              sockets[1].close();
              reject(err);
            });

            sockets[0].on("connect_error", (err) => {
              if (sockets[1].connected) {
                sockets[1].close();
              }
              sockets[0].close();
              reject(err);
            });

            sockets[0].connect();
            setTimeout((socket) => {
              socket.connect();
            }, 2000, sockets[1]);
          });
          expect(messages).toEqual([{
            content: 'coucou',
            id: 1,
            recipient: 'cleloup',
            author: {
              email: "fhenrion@student.42.fr",
              id: 1,
              name: "fhenrion",
            }
          }]);
        } catch (err) {
          throw err;
        }
      });
    });
    */

    describe('logout', () => {
      const empty_cookies = 'Authentication=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0,Refresh=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0';
      
      it('should return empty cookies', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/authentication/log-out')
          .set('cookie', cleloupCookies[0])
          .expect(200)
          .expect('set-cookie', empty_cookies);
        cleloupCookies = res.headers['set-cookie'];
      })
    });

    describe('authenticate after logout with empty cookie', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .get('/api/authentication')
          .set('cookie', cleloupCookies[0])
          .expect(401)
      });
    });

  });

});
