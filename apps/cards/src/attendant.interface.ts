import { Solicitation } from "apps/solicitation/solicitation.interfaces";

export interface Attendant {
    id: number;
    name: string;
    processingSolicitations: Array<Solicitation>
}