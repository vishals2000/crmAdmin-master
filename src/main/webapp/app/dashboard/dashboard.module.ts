import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CrmAdminBarchartModule } from './barchart/barchart.module';
import { CrmAdminDoughnutchartModule } from './doughnutchart/doughnutchart.module';
import { CrmAdminLinechartModule } from './linechart/linechart.module';
import { CrmAdminPiechartModule } from './piechart/piechart.module';
import { CrmAdminPolarareachartModule } from './polarareachart/polarareachart.module';
import { CrmAdminRadarchartModule } from './radarchart/radarchart.module';

@NgModule({
    imports: [
        CrmAdminBarchartModule,
        CrmAdminDoughnutchartModule,
        CrmAdminLinechartModule,
        CrmAdminPiechartModule,
        CrmAdminPolarareachartModule,
        CrmAdminRadarchartModule,
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminDashboardModule {}
