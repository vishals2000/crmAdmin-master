import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    AudienceSegmentsService,
    AudienceSegmentsPopupService,
    AudienceSegmentsComponent,
    AudienceSegmentsDetailComponent,
    AudienceSegmentsDialogComponent,
    AudienceSegmentsPopupComponent,
    AudienceSegmentsDeletePopupComponent,
    AudienceSegmentsDeleteDialogComponent,
    audienceSegmentsRoute,
    audienceSegmentsPopupRoute,
    AudienceSegmentsResolvePagingParams,    
} from './';
import {
    UploadSegmentsPopupComponent,
    UploadSegmentsDialogComponent
} from './upload-segments-dialog.component'

const ENTITY_STATES = [
    ...audienceSegmentsRoute,
    ...audienceSegmentsPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        AudienceSegmentsComponent,
        AudienceSegmentsDetailComponent,
        AudienceSegmentsDialogComponent,
        AudienceSegmentsDeleteDialogComponent,
        AudienceSegmentsPopupComponent,
        AudienceSegmentsDeletePopupComponent,
        UploadSegmentsPopupComponent,
        UploadSegmentsDialogComponent
    ],
    entryComponents: [
        AudienceSegmentsComponent,
        AudienceSegmentsDialogComponent,
        AudienceSegmentsPopupComponent,
        AudienceSegmentsDeleteDialogComponent,
        AudienceSegmentsDeletePopupComponent,
        UploadSegmentsPopupComponent,
        UploadSegmentsDialogComponent
    ],
    providers: [
        AudienceSegmentsService,
        AudienceSegmentsPopupService,
        AudienceSegmentsResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminAudienceSegmentsModule {}
