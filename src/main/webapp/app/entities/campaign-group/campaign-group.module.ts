import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    CampaignGroupService,
    CampaignGroupPopupService,
    CampaignGroupComponent,
    CampaignGroupDetailComponent,
    CampaignGroupDialogComponent,
    CampaignGroupPopupComponent,
    CampaignGroupDeletePopupComponent,
    CampaignGroupDeleteDialogComponent,
    campaignGroupRoute,
    campaignGroupPopupRoute,
    CampaignGroupResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...campaignGroupRoute,
    ...campaignGroupPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CampaignGroupComponent,
        CampaignGroupDetailComponent,
        CampaignGroupDialogComponent,
        CampaignGroupDeleteDialogComponent,
        CampaignGroupPopupComponent,
        CampaignGroupDeletePopupComponent,
    ],
    entryComponents: [
        CampaignGroupComponent,
        CampaignGroupDialogComponent,
        CampaignGroupPopupComponent,
        CampaignGroupDeleteDialogComponent,
        CampaignGroupDeletePopupComponent,
    ],
    providers: [
        CampaignGroupService,
        CampaignGroupPopupService,
        CampaignGroupResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignGroupModule {}
