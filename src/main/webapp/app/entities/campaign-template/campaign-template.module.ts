import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CrmAdminSharedModule } from '../../shared';
import {
    CampaignTemplateService,
    CampaignTemplatePopupService,
    CampaignTemplateComponent,
    CampaignTemplateDetailComponent,
    CampaignTemplateDialogComponent,
    CampaignTemplatePopupComponent,
    CampaignTemplateDeletePopupComponent,
    CampaignTemplateDeleteDialogComponent,
    campaignTemplateRoute,
    campaignTemplatePopupRoute,
    CampaignTemplateResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...campaignTemplateRoute,
    ...campaignTemplatePopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        ReactiveFormsModule
    ],
    declarations: [
        CampaignTemplateComponent,
        CampaignTemplateDetailComponent,
        CampaignTemplateDialogComponent,
        CampaignTemplateDeleteDialogComponent,
        CampaignTemplatePopupComponent,
        CampaignTemplateDeletePopupComponent,
    ],
    entryComponents: [
        CampaignTemplateComponent,
        CampaignTemplateDialogComponent,
        CampaignTemplatePopupComponent,
        CampaignTemplateDeleteDialogComponent,
        CampaignTemplateDeletePopupComponent,
    ],
    providers: [
        CampaignTemplateService,
        CampaignTemplatePopupService,
        CampaignTemplateResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignTemplateModule {}
