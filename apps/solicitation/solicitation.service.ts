import { Job, Queue } from 'bull';
import { Cache } from 'cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Solicitation } from './solicitation.interfaces';
import { AttendantsService } from 'apps/cards/src/attendants.service';

@Injectable()
export class SolicitationService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private attendantsService: AttendantsService) { }

    async newSolicitation(team: string, solicitationBody: string): Promise<void> {
        let awaitProcessing = await this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_${team}`);
        if (awaitProcessing === undefined) {
            awaitProcessing = [];
        }
        const attendant = this.attendantsService.getAttendantWithFewerSolicitations();
        if (attendant && attendant !== 0) {
            const newSolicitationWithId = {
                id: uuidv4(),
                body: solicitationBody
            }
            this.attendantsService.setSolicitationToAttendant(attendant, newSolicitationWithId);
            console.log(
                `Solicitation ${solicitationBody} is being processed by ${attendant}`
            );
        } else {
            awaitProcessing.push({
                id: uuidv4(),
                body: solicitationBody
            })
            await this.cacheManager.set(`await_processing_${team}`, awaitProcessing, 0);
            console.log(
                `Solicitation ${solicitationBody} has bee add to await processing list`
            );
        }
    }

    async endSolicitation(team: string, solicitationId: string, attendantId: number, queue: Queue): Promise<string> {
        const ended = this.attendantsService.removeSolicitationFromAttendant(attendantId, solicitationId);
        const awaitProcessing = await this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_${team}`);
        if (awaitProcessing.length > 0) {
            const processWaitProcessing = awaitProcessing.shift()
            queue.add({ solicitation: processWaitProcessing.body })
            await this.cacheManager.set(`await_processing_${team}`, awaitProcessing, 0);
            console.log(`Awaiting solicitation ${JSON.stringify(processWaitProcessing)} sended to process!`)
        }
        return `Solicitation ${ended.body} success closed!`
    }
}
