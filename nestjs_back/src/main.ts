import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.enableCors({
   credentials: true,
    origin: 'http://localhost:3000'
  });

  const config = new DocumentBuilder()
    .setTitle('PONG WARS API')
    .setDescription('API documentation for our wonderful front-end dev! ❤️')
    .setVersion('0.1')
    .addBearerAuth({ type: 'http' }, 'bearer-authentication')
    .addBearerAuth({ type: 'http' }, 'bearer-refresh')
    .addCookieAuth('Authentication', { type: 'apiKey'}, 'cookie-authentication')
    .addCookieAuth('Refresh', { type: 'apiKey' }, 'cookie-refresh')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req: { credentials: string; }) => {
        req.credentials = 'include';
        return req;
      },
    },
    customCss: '.swagger-ui .topbar { display: none; }',
    customSiteTitle: 'PONG WARS API',
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(8080);
}
bootstrap();
