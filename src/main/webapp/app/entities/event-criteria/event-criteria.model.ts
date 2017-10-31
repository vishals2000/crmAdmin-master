import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class EventCriteria implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public eventName?: string,
        public eventComparison?: string,
        public eventValue?: string,
    ) {
    }
}
