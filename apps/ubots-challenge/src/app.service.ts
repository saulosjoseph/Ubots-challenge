import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('cards') private cardsQueue: Queue) { }

  getHello(): string {
    return 'Hello World!';
  }
  sendToCardsTeam(body: string): void {
    this.cardsQueue.add({ solicitation: body })
  }
  sendToLoanTeam(): string {
    return 'Hello World!';
  }
  sendToOthersTeam(): string {
    return 'Hello World!';
  }
}
