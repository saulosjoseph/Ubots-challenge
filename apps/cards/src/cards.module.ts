import { Module } from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { CardsProcessor } from './cards.processor';
import { CardsController } from './cards.controller';
import { SolicitationService } from 'apps/solicitation/solicitation.service';
import { AttendantsService } from './attendants.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'cards',
    })
  ],
  controllers: [CardsController],
  providers: [CardsProcessor, SolicitationService, AttendantsService],
})
export class CardsModule { }
