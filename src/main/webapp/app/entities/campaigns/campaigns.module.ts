import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    CampaignsService,
    CampaignsPopupService,
    CampaignsComponent,
    CampaignsDetailComponent,
    CampaignsDialogComponent,
    CampaignsPopupComponent,
    CampaignsDeletePopupComponent,
    CampaignsDeleteDialogComponent,
    campaignsRoute,
    campaignsPopupRoute,
    CampaignsResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...campaignsRoute,
    ...campaignsPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CampaignsComponent,
        CampaignsDetailComponent,
        CampaignsDialogComponent,
        CampaignsDeleteDialogComponent,
        CampaignsPopupComponent,
        CampaignsDeletePopupComponent,
    ],
    entryComponents: [
        CampaignsComponent,
        CampaignsDialogComponent,
        CampaignsPopupComponent,
        CampaignsDeleteDialogComponent,
        CampaignsDeletePopupComponent,
    ],
    providers: [
        CampaignsService,
        CampaignsPopupService,
        CampaignsResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignsModule {}
