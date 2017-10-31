import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

const enum RecurrenceType {
    'NONE',
    'WEEKLY',
    'DAILY'
}

export class CampaignTemplate implements BaseEntity {
    constructor(
        public id?: string,
        public frontEnd?: string,
        public product?: Product,
        public campaignName?: string,
        public campaignDescription?: string,
        public startDate?: any,
        public recurrenceType?: RecurrenceType,
        public recurrenceEndDate?: any,
        public messageContentId?: string,
        public targetGroupId?: string,
        public scheduledTime?: string,
        public inPlayerTimezone?: boolean,
    ) {
        this.inPlayerTimezone = false;
    }
}
