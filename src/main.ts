import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.FRONT_URL, credentials: true },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}

bootstrap();
