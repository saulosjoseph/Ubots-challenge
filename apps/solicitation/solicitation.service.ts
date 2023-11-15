import { Job, Queue } from 'bull';
import { Cache } from 'cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Solicitation } from './solicitation.interfaces';

@Injectable()
export class SolicitationService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async newSolicitation(team: string, solicitationBody: string): Promise<void> {
        let processing = await this.cacheManager.get<Array<Solicitation> | undefined>(`processing_${team}`);
        let awaitProcessing = await this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_${team}`);
        if (processing === undefined) {
            processing = [];
        }
        if (awaitProcessing === undefined) {
            awaitProcessing = [];
        }
        if (processing.length >= 3) {
            awaitProcessing.push({
                id: uuidv4(),
                body: solicitationBody
            })
            await this.cacheManager.set(`await_processing_${team}`, awaitProcessing, 0);
            console.log(
                `Solicitation ${solicitationBody} has bee add to await processing list`
            );
        } else {
            processing.push({
                id: uuidv4(),
                body: solicitationBody
            })
            await this.cacheManager.set(`processing_${team}`, processing, 0);
            console.log(
                `Solicitation ${solicitationBody} is being processed`
            );
        }
    }

    async endSolicitation(team: string, id: string, queue: Queue): Promise<string> {
        const processing = await this.cacheManager.get<Array<Solicitation> | undefined>(`processing_${team}`);
        if (processing.length > 0) {
            const processed = processing.shift()
            await this.cacheManager.set(`processing_${team}`, processing, 0);
            const awaitProcessing = await this.cacheManager.get<Array<Solicitation> | undefined>(`await_processing_${team}`);
            if (awaitProcessing.length > 0) {
                const processWaitProcessing = awaitProcessing.shift()
                queue.add({ soliciation: processWaitProcessing.body })
                await this.cacheManager.set(`await_processing_${team}`, awaitProcessing, 0);
                return `Awaiting solicitation ${processWaitProcessing} sended to process!`

            }
            return `Solicitation ${processed.body} success closed!`
        }
        throw new HttpException(
            'No processing solicitations.',
            HttpStatus.BAD_REQUEST,
        );
    }
}
