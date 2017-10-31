import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class TagCriteria implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public tagName?: string,
        public tagComparison?: string,
        public tagValue?: string,
    ) {
    }
}
