import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class Apps implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public name?: string,
        public jurisdiction?: string,
        public description?: string,
    ) {
    }
}
