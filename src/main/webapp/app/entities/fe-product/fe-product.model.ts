import { BaseEntity } from './../../shared';

export const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class FeProduct implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
    ) {
    }
}
