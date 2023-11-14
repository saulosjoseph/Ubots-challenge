import { Injectable } from '@nestjs/common';

@Injectable()
export class CardsService {
  getHello(): string {
    return 'Hello World!';
  }
}
