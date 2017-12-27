import { BaseEntity } from './../../shared';

export class CampaignStat implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public scheduledTime?: string,
        public status?: string,
        public segmentSize?: number,
        public segmentSizeAfterCommonScrubbing?: number,
        public segmentSizeAfterCommunicationScrubbing?: number,
        public campaignId?: string,
    ) {
    }
}
