import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { TargetGroupCriteriaComponent } from './target-group-criteria.component';
import { TargetGroupCriteriaDetailComponent } from './target-group-criteria-detail.component';
import { TargetGroupCriteriaPopupComponent } from './target-group-criteria-dialog.component';
import { TargetGroupCriteriaDeletePopupComponent } from './target-group-criteria-delete-dialog.component';

@Injectable()
export class TargetGroupCriteriaResolvePagingParams implements Resolve<any> {

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

export const targetGroupCriteriaRoute: Routes = [
    {
        path: 'target-group-criteria',
        component: TargetGroupCriteriaComponent,
        resolve: {
            'pagingParams': TargetGroupCriteriaResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'TargetGroupCriteria'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'target-group-criteria/:id',
        component: TargetGroupCriteriaDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'TargetGroupCriteria'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const targetGroupCriteriaPopupRoute: Routes = [
    {
        path: 'target-group-criteria-new',
        component: TargetGroupCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'TargetGroupCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'target-group-criteria/:id/edit',
        component: TargetGroupCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'TargetGroupCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'target-group-criteria/:id/delete',
        component: TargetGroupCriteriaDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'TargetGroupCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
