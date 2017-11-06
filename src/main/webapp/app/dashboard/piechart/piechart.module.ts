import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import { ChartModule } from 'primeng/primeng';

import {
    PiechartComponent,
    piechartRoute
} from './';

const DASHBOARD_STATES = [
    piechartRoute
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        ChartModule,
        RouterModule.forRoot(DASHBOARD_STATES, { useHash: true })
    ],
    declarations: [
        PiechartComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminPiechartModule {}
