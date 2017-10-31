import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class MessageContent implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public contentName?: string,
        public contentTitle?: string,
        public contentBody?: string,
        public metaData?: string,
        public language?: string,
    ) {
    }
}
