import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CrmAdminSharedModule } from '../../shared';
import {
    ProjectsService,
    ProjectsPopupService,
    ProjectsComponent,
    ProjectsDetailComponent,
    ProjectsDialogComponent,
    ProjectsPopupComponent,
    ProjectsDeletePopupComponent,
    ProjectsDeleteDialogComponent,
    projectsRoute,
    projectsPopupRoute,
    ProjectsResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...projectsRoute,
    ...projectsPopupRoute,
];

@NgModule({
    imports: [
        CrmAdminSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ProjectsComponent,
        ProjectsDetailComponent,
        ProjectsDialogComponent,
        ProjectsDeleteDialogComponent,
        ProjectsPopupComponent,
        ProjectsDeletePopupComponent,
    ],
    entryComponents: [
        ProjectsComponent,
        ProjectsDialogComponent,
        ProjectsPopupComponent,
        ProjectsDeleteDialogComponent,
        ProjectsDeletePopupComponent,
    ],
    providers: [
        ProjectsService,
        ProjectsPopupService,
        ProjectsResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminProjectsModule {}
