import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    MessageContentService,
    MessageContentPopupService,
    MessageContentComponent,
    MessageContentDetailComponent,
    MessageContentDialogComponent,
    MessageContentPopupComponent,
    MessageContentDeletePopupComponent,
    MessageContentDeleteDialogComponent,
    messageContentRoute,
    messageContentPopupRoute,
    MessageContentResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...messageContentRoute,
    ...messageContentPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        MessageContentComponent,
        MessageContentDetailComponent,
        MessageContentDialogComponent,
        MessageContentDeleteDialogComponent,
        MessageContentPopupComponent,
        MessageContentDeletePopupComponent,
    ],
    entryComponents: [
        MessageContentComponent,
        MessageContentDialogComponent,
        MessageContentPopupComponent,
        MessageContentDeleteDialogComponent,
        MessageContentDeletePopupComponent,
    ],
    providers: [
        MessageContentService,
        MessageContentPopupService,
        MessageContentResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminMessageContentModule {}
