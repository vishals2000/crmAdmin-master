import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

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

import { CampaignTemplateLaunchDialogComponent, CampaignTemplateLaunchPopupComponent } from './campaign-template-launch-dialog.component';

const ENTITY_STATES = [
    ...campaignTemplateRoute,
    ...campaignTemplatePopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CampaignTemplateComponent,
        CampaignTemplateDetailComponent,
        CampaignTemplateDialogComponent,
        CampaignTemplateDeleteDialogComponent,
        CampaignTemplateLaunchDialogComponent,
        CampaignTemplatePopupComponent,
        CampaignTemplateDeletePopupComponent,
        CampaignTemplateLaunchPopupComponent,
    ],
    entryComponents: [
        CampaignTemplateComponent,
        CampaignTemplateDialogComponent,
        CampaignTemplatePopupComponent,
        CampaignTemplateDeleteDialogComponent,
        CampaignTemplateLaunchDialogComponent,
        CampaignTemplateDeletePopupComponent,
        CampaignTemplateLaunchPopupComponent,
    ],
    providers: [
        CampaignTemplateService,
        CampaignTemplatePopupService,
        CampaignTemplateResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminCampaignTemplateModule {}
