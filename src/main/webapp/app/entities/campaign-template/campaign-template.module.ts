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
    CampaignTemplateDialogResolvePagingParams
} from './';

import {
    CampaignTemplateLaunchPopupComponent,
    CampaignTemplateLaunchDialogComponent
} from './campaign-template-launch-dialog.component'

import {
    CampaignTemplateCancelPopupComponent,
    CampaignTemplateCancelDialogComponent
} from './campaign-template-cancel-dialog.component'

import { CampaignTemplateCopyToPopupComponent, CampaignTemplateCopyToDialogComponent } from './campaign-template-copyto-dialog.component';

import {
    CampaignTemplateTestPopupComponent,
    CampaignTemplateTestDialogComponent
} from './campaign-template-test-dialog.component'
import { BreadCrumbService } from '../../layouts/navbar/navbar.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
const ENTITY_STATES = [
    ...campaignTemplateRoute,
    ...campaignTemplatePopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        ChartModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        ReactiveFormsModule,
        AngularMultiSelectModule
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
        CampaignTemplateCancelDialogComponent,
        CampaignTemplateCopyToPopupComponent,
        CampaignTemplateCopyToDialogComponent
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
        CampaignTemplateCancelDialogComponent,
        CampaignTemplateCopyToPopupComponent,
        CampaignTemplateCopyToDialogComponent
    ],
    providers: [
        CampaignTemplateService,
        CampaignTemplatePopupService,
        CampaignTemplateResolvePagingParams,
        CampaignTemplateDialogResolvePagingParams,
        BreadCrumbService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignTemplateModule { }
