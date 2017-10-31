import { BaseEntity } from './../../shared';

export class CampaignGroup implements BaseEntity {
    constructor(
        public id?: string,
        public name?: string,
        public description?: string,
        public projectId?: string,
    ) {
    }
}
