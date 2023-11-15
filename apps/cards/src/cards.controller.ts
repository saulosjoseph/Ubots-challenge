import { Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SolicitationService } from 'apps/solicitation/solicitation.service';
import { Solicitation } from 'apps/solicitation/solicitation.interfaces';
import { AttendantsService } from './attendants.service';
import { Attendant } from './attendant.interface';

@Controller()
export class CardsController {
  constructor(@InjectQueue('cards') private cardsQueue: Queue, @Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly solicitationService: SolicitationService, private readonly attendantsService: AttendantsService) { }
  @Post(":attendantId/close/:solicitationId")
  async endSolicitation(@Param('attendantId', ParseIntPipe) attendantId: number, @Param('solicitationId') solicitationId: string): Promise<string> {
    return this.solicitationService.endSolicitation('cards', solicitationId, attendantId, this.cardsQueue)
  }

  @Get('attendant/:attendantId')
  getProcessingSolicitations(@Param('attendantId', ParseIntPipe) attendantId: number): { name: string, processingSolicitations: Array<Solicitation> } {
    return this.attendantsService.getSolicitationsByAttendant(attendantId);
  }

  @Get('/awaiting')
  async getAwaitingSolicitations(): Promise<Array<Solicitation>> {
    return this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_cards`);
  }

  @Get('/attendants')
  getState(): Array<Attendant> {
    return this.attendantsService.getState();
  }
}
