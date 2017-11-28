import { BaseEntity } from './../../shared';

export class AudienceSegments implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public type?: string,
        public estimate?: string,
        public lastEstimatedAt?: string,
        public modifiedAt?: string,
        public createdAt?: string,
        public frontEnd?: string,
        public product?: string,
    ) {
    }
}
