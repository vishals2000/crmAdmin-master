import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import { ChartModule } from 'primeng/primeng';

import {
    LinechartComponent,
    linechartRoute
} from './';

const DASHBOARD_STATES = [
    linechartRoute
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        ChartModule,
        RouterModule.forRoot(DASHBOARD_STATES, { useHash: true })
    ],
    declarations: [
        LinechartComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminLinechartModule {}
