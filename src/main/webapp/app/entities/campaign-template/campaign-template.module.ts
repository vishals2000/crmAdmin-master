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
    CampaignTemplateCancelPopupComponent,
    CampaignTemplateCancelDialogComponent
} from './campaign-template-cancel-dialog.component'

import {
    CampaignTemplateTestPopupComponent,
    CampaignTemplateTestDialogComponent
} from './campaign-template-test-dialog.component'
import { BreadCrumbService } from '../../layouts/navbar/navbar.service';
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
        CampaignTemplateTestDialogComponent,
        CampaignTemplateCancelPopupComponent,
        CampaignTemplateCancelDialogComponent
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
        CampaignTemplateTestDialogComponent,
        CampaignTemplateCancelPopupComponent,
        CampaignTemplateCancelDialogComponent
    ],
    providers: [
        CampaignTemplateService,
        CampaignTemplatePopupService,
        CampaignTemplateResolvePagingParams,
        BreadCrumbService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignTemplateModule { }
