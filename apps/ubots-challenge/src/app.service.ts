import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('CARDS_SERVICE') private cardsClient: ClientProxy) { }

  getHello(): string {
    return 'Hello World!';
  }
  sendToCardsTeam(body: string): void {
    console.log(body);
    this.cardsClient.emit<string>('new_solicitation', body);
  }
  sendToLoanTeam(): string {
    return 'Hello World!';
  }
  sendToOthersTeam(): string {
    return 'Hello World!';
  }
}
