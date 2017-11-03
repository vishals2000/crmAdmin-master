import { BaseEntity } from './../../shared';

export const enum RecurrenceType {
    'NONE',
    'WEEKLY',
    'DAILY'
}

export const enum FilterOption {
    'App',
    'App Version',
    'Country',
    'Event',
    'Install Date',
    'Language',
    'Last Open Date',
    'OS',
    'Segment',
    'Tag',
    'Timezone'
}

const enum FilterOptionComparison {
    'is',
    'is not'
}

const enum LanguageComparision {
    'is',
    'is not'
}

export class CampaignTemplate implements BaseEntity {
    constructor(
        public id?: string,
        public campaignName?: string,
        public campaignDescription?: string,
        public startDate?: any,
        public recurrenceType?: RecurrenceType,
        public recurrenceEndDate?: any,
        public scheduledTime?: string,
        public inPlayerTimezone?: boolean,
        public campaignGroupId?: string,
        public filterOption?: FilterOption,
        public filterOptionComparison?: FilterOptionComparison,
        public filterOptionValue?: string,
        public contentName?: string,
        public contentTitle?: string,
        public contentBody?: string,
        public metaData?: string,
        public languageComparision?: LanguageComparision,
    ) {
        this.inPlayerTimezone = false;
    }
}

export class CampaignTemplateFilterCriterion {
    // filterOption = '';
    // filterOptionLookUp = '';
    // filterOptionComparison = '';
    // filterOptionValue = '';
    // filterOptionValues = [];
    // filterOptionLookUpValues = [];
    // filterOptionComparisonValues = [];
    // filterOptionValueValues = [];
    constructor(
        public filterOption: string,
        public filterOptionLookUp: string,
        public filterOptionComparison: string,
        public filterOptionValue: string[],
    ) {
    }
}
