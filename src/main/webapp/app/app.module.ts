import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { CrmAdminSharedModule, UserRouteAccessService } from './shared';
import { CrmAdminHomeModule } from './home/home.module';
import { CrmAdminAdminModule } from './admin/admin.module';
import { CrmAdminAccountModule } from './account/account.module';
import { CrmAdminEntityModule } from './entities/entity.module';

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgbdTimepickerValidationComponent } from './entities/campaign-template/campaign-template-dialog.component'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CrmAdminDashboardModule } from './dashboard/dashboard.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// jhipster-needle-angular-add-module-import JHipster will add new module here

import {
    JhiMainComponent,
    LayoutRoutingModule,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        CrmAdminSharedModule,
        CrmAdminHomeModule,
        CrmAdminAdminModule,
        CrmAdminAccountModule,
        CrmAdminEntityModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        CrmAdminDashboardModule,
        AngularMultiSelectModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        NgbdTimepickerValidationComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class CrmAdminAppModule {}
