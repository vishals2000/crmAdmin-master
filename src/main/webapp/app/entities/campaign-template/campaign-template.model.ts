import { BaseEntity } from './../../shared';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import { ChartModule } from 'primeng/primeng';
import {
    PiechartComponent,
    piechartRoute
} from '../../dashboard/piechart';
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
    // id: string;
    frontEnd = '';
    product = '';
    name = '';
    // targetGroupFilterCriteria: CampaignTemplateFilterCriterion[];

    constructor(
        public id?: string,
        public campaignName?: string,
        public status?: string,
        public campaignDescription?: string,
        public startDate?: any,
        public recurrenceType?: RecurrenceType,
        public recurrenceEndDate?: any,
        public scheduledTime?: string,
        public inPlayerTimezone?: boolean,
        public campaignGroupId?: string,
        public targetGroupFilterCriteria?: CampaignTemplateFilterCriterion[],
        public targetGroupContentCriteria?: CampaignTemplateContentCriterion[],
        // public campaignTemplateFilterCriteria?: CampaignTemplateFilterCriterion[],
        // public filterOption?: FilterOption,
        // public filterOptionComparison?: FilterOptionComparison,
        // public filterOptionValue?: string,
        // public contentName?: string,
        public contentTitle?: string,
        public contentBody?: string,
        public metaData?: string,
        public languageSelected?: any,
        public sendImmediately?: boolean,
        public optimoveInstances?: string[],
        public pushToOptimoveInstances?: boolean,
    ) {
        this.inPlayerTimezone = false;
        this.sendImmediately = false;
        this.targetGroupFilterCriteria = [];
        // this.campaignTemplateFilterCriteria = [];
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
        public simpleDate : any
    ) {
    }
}

export class CampaignTemplateContentCriterion {
    constructor(
        //public contentName: string,
        public contentTitle: string,
        public contentBody: string,
        public languageSelected: string,
    ) {
    }
}
export class CampaignTargetGroupSizeRequest {
    constructor(
        public frontEnd: string,
        public product: string,
        public targetGroupContentCriteria: string[],
        public targetGroupFilterCriteria?: TargetGroupFilterCriterionSizeRequest[],
    ) {
    }
}

export class TargetGroupFilterCriterionSizeRequest {
    constructor(
        public filterOption: string,
        public filterOptionLookUp: string,
        public filterOptionComparison: string,
        public filterOptionValue: string[],
    ) {
    }
}

const DASHBOARD_STATES = [
    piechartRoute
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        ChartModule,
        RouterModule.forRoot(DASHBOARD_STATES, { useHash: true })
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminPiechartModule { }
