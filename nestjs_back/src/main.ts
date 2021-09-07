import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    .setTitle('PONG WARS')
    .setDescription('Pong wars API description')
    .setVersion('0.1')
    .addTag('ft_transcendance')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8080);
}
bootstrap();
