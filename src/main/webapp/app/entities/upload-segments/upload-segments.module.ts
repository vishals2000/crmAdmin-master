import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    UploadSegmentsService,
    UploadSegmentsPopupService,
    UploadSegmentsComponent,
    UploadSegmentsDetailComponent,
    UploadSegmentsDialogComponent,
    UploadSegmentsPopupComponent,
    UploadSegmentsDeletePopupComponent,
    UploadSegmentsDeleteDialogComponent,
    uploadSegmentsRoute,
    uploadSegmentsPopupRoute,
    UploadSegmentsResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...uploadSegmentsRoute,
    ...uploadSegmentsPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        UploadSegmentsComponent,
        UploadSegmentsDetailComponent,
        UploadSegmentsDialogComponent,
        UploadSegmentsDeleteDialogComponent,
        UploadSegmentsPopupComponent,
        UploadSegmentsDeletePopupComponent,
    ],
    entryComponents: [
        UploadSegmentsComponent,
        UploadSegmentsDialogComponent,
        UploadSegmentsPopupComponent,
        UploadSegmentsDeleteDialogComponent,
        UploadSegmentsDeletePopupComponent,
    ],
    providers: [
        UploadSegmentsService,
        UploadSegmentsPopupService,
        UploadSegmentsResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminUploadSegmentsModule {}
