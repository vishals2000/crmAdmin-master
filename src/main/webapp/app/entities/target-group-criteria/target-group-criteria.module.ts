import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    TargetGroupCriteriaService,
    TargetGroupCriteriaPopupService,
    TargetGroupCriteriaComponent,
    TargetGroupCriteriaDetailComponent,
    TargetGroupCriteriaDialogComponent,
    TargetGroupCriteriaPopupComponent,
    TargetGroupCriteriaDeletePopupComponent,
    TargetGroupCriteriaDeleteDialogComponent,
    targetGroupCriteriaRoute,
    targetGroupCriteriaPopupRoute,
    TargetGroupCriteriaResolvePagingParams,
} from './';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

const ENTITY_STATES = [
    ...targetGroupCriteriaRoute,
    ...targetGroupCriteriaPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        ReactiveFormsModule,
    ],
    declarations: [
        TargetGroupCriteriaComponent,
        TargetGroupCriteriaDetailComponent,
        TargetGroupCriteriaDialogComponent,
        TargetGroupCriteriaDeleteDialogComponent,
        TargetGroupCriteriaPopupComponent,
        TargetGroupCriteriaDeletePopupComponent,
    ],
    entryComponents: [
        TargetGroupCriteriaComponent,
        TargetGroupCriteriaDialogComponent,
        TargetGroupCriteriaPopupComponent,
        TargetGroupCriteriaDeleteDialogComponent,
        TargetGroupCriteriaDeletePopupComponent,
    ],
    providers: [
        TargetGroupCriteriaService,
        TargetGroupCriteriaPopupService,
        TargetGroupCriteriaResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminTargetGroupCriteriaModule {}
