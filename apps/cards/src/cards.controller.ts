import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SolicitationService } from 'apps/solicitation/solicitation.service';
import { Solicitation } from 'apps/solicitation/solicitation.interfaces';

@Controller()
export class CardsController {
  constructor(@InjectQueue('cards') private cardsQueue: Queue, @Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly solicitationService: SolicitationService) { }
  @Post("/close/:id")
  async endSolicitation(@Param('id') id: string): Promise<string> {
    return this.solicitationService.endSolicitation('cards', id, this.cardsQueue)
  }

  @Get('/processing')
  async getProcessingSolicitations(): Promise<Array<Solicitation>> {
    return await this.cacheManager.get<Array<Solicitation> | undefined>(`processing_cards`);
  }

  @Get('/awaiting')
  async getAwaitingSolicitations(): Promise<Array<Solicitation>> {
    return await this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_cards`);
  }
}
