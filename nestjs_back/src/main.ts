import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

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
  await app.listen(8080);
}
bootstrap();
