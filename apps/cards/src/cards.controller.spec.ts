import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardsController', () => {
  let cardsController: CardsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService],
    }).compile();

    cardsController = app.get<CardsController>(CardsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cardsController.getHello()).toBe('Hello World!');
    });
  });
});
