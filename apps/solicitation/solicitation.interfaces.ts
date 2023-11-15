export interface Solicitation {
    id: string;
    body: string;
}
export interface ProcessingSolicitation extends Solicitation {
    attendant: string;
}