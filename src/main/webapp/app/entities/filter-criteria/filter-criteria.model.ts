import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class FilterCriteria implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public filterItem?: string,
        public filterQuery?: string,
        public filterValue?: string,
    ) {
    }
}
