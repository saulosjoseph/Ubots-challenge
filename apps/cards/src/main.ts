import { NestFactory } from '@nestjs/core';
import { CardsModule } from './cards.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CardsModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
