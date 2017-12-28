import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ProjectsComponent } from './projects.component';
import { ProjectsDetailComponent } from './projects-detail.component';
import { ProjectsPopupComponent } from './projects-dialog.component';
import { ProjectsDeletePopupComponent } from './projects-delete-dialog.component';

@Injectable()
export class ProjectsResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const projectsRoute: Routes = [
    {
        path: 'projects',
        component: ProjectsComponent,
        resolve: {
            'pagingParams': ProjectsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Projects'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'projects/:id',
        component: ProjectsDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Projects'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const projectsPopupRoute: Routes = [
    {
        path: 'projects-new',
        component: ProjectsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Projects'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'projects/:id/edit',
        component: ProjectsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Projects'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'projects/:id/delete',
        component: ProjectsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Projects'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
