import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    FilterCriteriaService,
    FilterCriteriaPopupService,
    FilterCriteriaComponent,
    FilterCriteriaDetailComponent,
    FilterCriteriaDialogComponent,
    FilterCriteriaPopupComponent,
    FilterCriteriaDeletePopupComponent,
    FilterCriteriaDeleteDialogComponent,
    filterCriteriaRoute,
    filterCriteriaPopupRoute,
} from './';

const ENTITY_STATES = [
    ...filterCriteriaRoute,
    ...filterCriteriaPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FilterCriteriaComponent,
        FilterCriteriaDetailComponent,
        FilterCriteriaDialogComponent,
        FilterCriteriaDeleteDialogComponent,
        FilterCriteriaPopupComponent,
        FilterCriteriaDeletePopupComponent,
    ],
    entryComponents: [
        FilterCriteriaComponent,
        FilterCriteriaDialogComponent,
        FilterCriteriaPopupComponent,
        FilterCriteriaDeleteDialogComponent,
        FilterCriteriaDeletePopupComponent,
    ],
    providers: [
        FilterCriteriaService,
        FilterCriteriaPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminFilterCriteriaModule {}
