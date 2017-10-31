import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    FeProductService,
    FeProductPopupService,
    FeProductComponent,
    FeProductDetailComponent,
    FeProductDialogComponent,
    FeProductPopupComponent,
    FeProductDeletePopupComponent,
    FeProductDeleteDialogComponent,
    feProductRoute,
    feProductPopupRoute,
} from './';

const ENTITY_STATES = [
    ...feProductRoute,
    ...feProductPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FeProductComponent,
        FeProductDetailComponent,
        FeProductDialogComponent,
        FeProductDeleteDialogComponent,
        FeProductPopupComponent,
        FeProductDeletePopupComponent,
    ],
    entryComponents: [
        FeProductComponent,
        FeProductDialogComponent,
        FeProductPopupComponent,
        FeProductDeleteDialogComponent,
        FeProductDeletePopupComponent,
    ],
    providers: [
        FeProductService,
        FeProductPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminFeProductModule {}
