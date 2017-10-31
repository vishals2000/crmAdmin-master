import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    TagCriteriaService,
    TagCriteriaPopupService,
    TagCriteriaComponent,
    TagCriteriaDetailComponent,
    TagCriteriaDialogComponent,
    TagCriteriaPopupComponent,
    TagCriteriaDeletePopupComponent,
    TagCriteriaDeleteDialogComponent,
    tagCriteriaRoute,
    tagCriteriaPopupRoute,
    TagCriteriaResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...tagCriteriaRoute,
    ...tagCriteriaPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TagCriteriaComponent,
        TagCriteriaDetailComponent,
        TagCriteriaDialogComponent,
        TagCriteriaDeleteDialogComponent,
        TagCriteriaPopupComponent,
        TagCriteriaDeletePopupComponent,
    ],
    entryComponents: [
        TagCriteriaComponent,
        TagCriteriaDialogComponent,
        TagCriteriaPopupComponent,
        TagCriteriaDeleteDialogComponent,
        TagCriteriaDeletePopupComponent,
    ],
    providers: [
        TagCriteriaService,
        TagCriteriaPopupService,
        TagCriteriaResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminTagCriteriaModule {}
