import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    EventCriteriaService,
    EventCriteriaPopupService,
    EventCriteriaComponent,
    EventCriteriaDetailComponent,
    EventCriteriaDialogComponent,
    EventCriteriaPopupComponent,
    EventCriteriaDeletePopupComponent,
    EventCriteriaDeleteDialogComponent,
    eventCriteriaRoute,
    eventCriteriaPopupRoute,
    EventCriteriaResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...eventCriteriaRoute,
    ...eventCriteriaPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EventCriteriaComponent,
        EventCriteriaDetailComponent,
        EventCriteriaDialogComponent,
        EventCriteriaDeleteDialogComponent,
        EventCriteriaPopupComponent,
        EventCriteriaDeletePopupComponent,
    ],
    entryComponents: [
        EventCriteriaComponent,
        EventCriteriaDialogComponent,
        EventCriteriaPopupComponent,
        EventCriteriaDeleteDialogComponent,
        EventCriteriaDeletePopupComponent,
    ],
    providers: [
        EventCriteriaService,
        EventCriteriaPopupService,
        EventCriteriaResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminEventCriteriaModule {}
