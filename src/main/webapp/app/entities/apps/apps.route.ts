import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AppsComponent } from './apps.component';
import { AppsDetailComponent } from './apps-detail.component';
import { AppsPopupComponent } from './apps-dialog.component';
import { AppsDeletePopupComponent } from './apps-delete-dialog.component';

@Injectable()
export class AppsResolvePagingParams implements Resolve<any> {

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

export const appsRoute: Routes = [
    {
        path: 'apps',
        component: AppsComponent,
        resolve: {
            'pagingParams': AppsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Apps'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'apps/:id',
        component: AppsDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Apps'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const appsPopupRoute: Routes = [
    {
        path: 'apps-new',
        component: AppsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Apps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'apps/:id/edit',
        component: AppsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Apps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'apps/:id/delete',
        component: AppsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Apps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
