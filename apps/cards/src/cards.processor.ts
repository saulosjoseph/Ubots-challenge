import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SolicitationService } from 'apps/solicitation/solicitation.service';

@Processor('cards')
export class CardsProcessor {
  constructor(private readonly solicitationService: SolicitationService) { }

  @Process()
  async handleNewSolicitation(job: Job<{ solicitation: string }>): Promise<void> {
    this.solicitationService.newSolicitation('cards', job.data.solicitation);
  }
}
