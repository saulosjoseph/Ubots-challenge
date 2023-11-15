import { Cache } from 'cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Solicitation } from 'apps/solicitation/solicitation.interfaces';
import { Attendant } from './attendant.interface';

@Injectable()
export class AttendantsService {
    private attendantsList: Array<Attendant> = [{
        id: 1,
        name: 'AtendenteCards00',
        processingSolicitations: []
    }, {
        id: 2,
        name: 'AtendenteCards01',
        processingSolicitations: []
    }, {
        id: 3,
        name: 'AtendenteCards02',
        processingSolicitations: []
    }];
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    getAttendantWithFewerSolicitations(): number {
        const attendantWithfewerSolicitations = {
            id: 0,
            solicitations: Infinity
        };
        this.attendantsList.forEach(attendat => {
            if (attendat.processingSolicitations.length <= attendantWithfewerSolicitations.solicitations) {
                attendantWithfewerSolicitations.id = attendat.id;
                attendantWithfewerSolicitations.solicitations = attendat.processingSolicitations.length;
            }
        });
        if (attendantWithfewerSolicitations.solicitations >= 1) {
            return undefined;
        }
        return attendantWithfewerSolicitations.id;
    }

    setSolicitationToAttendant(attendantId: number, solicitation: Solicitation): void {
        const indexAttendant = this.attendantsList.findIndex(attendant => attendant.id === attendantId);
        this.attendantsList[indexAttendant].processingSolicitations.push(solicitation);
    }

    removeSolicitationFromAttendant(attendantId: number, solicitationId: string): Solicitation {
        const indexAttendant = this.attendantsList.findIndex(attendant => attendant.id === attendantId);
        const indexSolicitation = this.attendantsList[indexAttendant].processingSolicitations.findIndex(processingSolicitation => processingSolicitation.id === solicitationId);
        if (indexSolicitation === -1) {
            throw new HttpException(
                'No processing solicitation.',
                HttpStatus.BAD_REQUEST,
            );
        }
        const solicitation = JSON.parse(JSON.stringify(this.attendantsList[indexAttendant].processingSolicitations[indexSolicitation])) as Solicitation;
        this.attendantsList[indexAttendant].processingSolicitations.splice(indexSolicitation, 1);
        return solicitation;
    }

    getSolicitationsByAttendant(attendantId: number): Attendant {
        return this.attendantsList.filter(attendant => attendant.id === attendantId)[0];
    }

    getState(): Array<Attendant> {
        return this.attendantsList;
    }
}
