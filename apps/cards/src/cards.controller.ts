import { Controller } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @EventPattern('new_solicitation')
  handlenewSolicitation(@Payload() body: string, @Ctx() context: RedisContext): void {
    console.log(body);
    console.log(context);
  }
}
