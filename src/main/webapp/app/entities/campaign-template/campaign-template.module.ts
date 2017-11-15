import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CrmAdminSharedModule } from '../../shared';
import { ChartModule } from 'primeng/primeng';
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

import {
    CampaignTemplateLaunchPopupComponent,
    CampaignTemplateLaunchDialogComponent
} from './campaign-template-launch-dialog.component'

import {
    CampaignTemplateTestPopupComponent,
    CampaignTemplateTestDialogComponent
} from './campaign-template-test-dialog.component'

const ENTITY_STATES = [
    ...campaignTemplateRoute,
    ...campaignTemplatePopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        ChartModule,
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
        CampaignTemplateLaunchPopupComponent,
        CampaignTemplateLaunchDialogComponent,
        CampaignTemplateTestPopupComponent,
        CampaignTemplateTestDialogComponent
    ],
    entryComponents: [
        CampaignTemplateComponent,
        CampaignTemplateDialogComponent,
        CampaignTemplatePopupComponent,
        CampaignTemplateDeleteDialogComponent,
        CampaignTemplateDeletePopupComponent,
        CampaignTemplateLaunchPopupComponent,
        CampaignTemplateLaunchDialogComponent,
        CampaignTemplateTestPopupComponent,
        CampaignTemplateTestDialogComponent
    ],
    providers: [
        CampaignTemplateService,
        CampaignTemplatePopupService,
        CampaignTemplateResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignTemplateModule { }
