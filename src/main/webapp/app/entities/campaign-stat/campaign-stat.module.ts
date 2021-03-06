import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    CampaignStatService,
    CampaignStatPopupService,
    CampaignStatComponent,
    CampaignStatDetailComponent,
    CampaignStatDialogComponent,
    CampaignStatPopupComponent,
    CampaignStatDeletePopupComponent,
    CampaignStatDeleteDialogComponent,
    campaignStatRoute,
    campaignStatPopupRoute,
} from './';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

const ENTITY_STATES = [
    ...campaignStatRoute,
    ...campaignStatPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        AngularMultiSelectModule
    ],
    declarations: [
        CampaignStatComponent,
        CampaignStatDetailComponent,
        CampaignStatDialogComponent,
        CampaignStatDeleteDialogComponent,
        CampaignStatPopupComponent,
        CampaignStatDeletePopupComponent,
    ],
    entryComponents: [
        CampaignStatComponent,
        CampaignStatDialogComponent,
        CampaignStatPopupComponent,
        CampaignStatDeleteDialogComponent,
        CampaignStatDeletePopupComponent,
    ],
    providers: [
        CampaignStatService,
        CampaignStatPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignStatModule {}
