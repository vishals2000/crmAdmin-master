import { BaseEntity } from './../../shared';

const enum Product {
    'CASINO',
    'POKER',
    'SPORTS'
}

export class TargetGroupCriteria implements BaseEntity {
    id: string;
    frontEnd = '';
    product = '';
    name = '';
    targetGroupFilterCriteria: TargetGroupFilterCriterion[];
    // constructor(
    //     public id?: string,
    //     public frontEnd?: string,
    //     public product?: Product,
    //     public name?: string,
    //     public targetGroupFilterCriteria?: TargetGroupFilterCriterion[],
    // ) {
    // }
}

export class TargetGroupFilterCriterion {
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

export class CampaignTargetGroupSizeRequest {
    constructor(
        public frontEnd: string,
        public product: string,
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
