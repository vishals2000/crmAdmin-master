import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    AppsService,
    AppsPopupService,
    AppsComponent,
    AppsDetailComponent,
    AppsDialogComponent,
    AppsPopupComponent,
    AppsDeletePopupComponent,
    AppsDeleteDialogComponent,
    appsRoute,
    appsPopupRoute,
    AppsResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...appsRoute,
    ...appsPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        AppsComponent,
        AppsDetailComponent,
        AppsDialogComponent,
        AppsDeleteDialogComponent,
        AppsPopupComponent,
        AppsDeletePopupComponent,
    ],
    entryComponents: [
        AppsComponent,
        AppsDialogComponent,
        AppsPopupComponent,
        AppsDeleteDialogComponent,
        AppsDeletePopupComponent,
    ],
    providers: [
        AppsService,
        AppsPopupService,
        AppsResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminAppsModule {}
