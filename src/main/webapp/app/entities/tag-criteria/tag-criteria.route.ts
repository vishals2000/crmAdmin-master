import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { TagCriteriaComponent } from './tag-criteria.component';
import { TagCriteriaDetailComponent } from './tag-criteria-detail.component';
import { TagCriteriaPopupComponent } from './tag-criteria-dialog.component';
import { TagCriteriaDeletePopupComponent } from './tag-criteria-delete-dialog.component';

@Injectable()
export class TagCriteriaResolvePagingParams implements Resolve<any> {

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

export const tagCriteriaRoute: Routes = [
    {
        path: 'tag-criteria',
        component: TagCriteriaComponent,
        resolve: {
            'pagingParams': TagCriteriaResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TagCriteria'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'tag-criteria/:id',
        component: TagCriteriaDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TagCriteria'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const tagCriteriaPopupRoute: Routes = [
    {
        path: 'tag-criteria-new',
        component: TagCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TagCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'tag-criteria/:id/edit',
        component: TagCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TagCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'tag-criteria/:id/delete',
        component: TagCriteriaDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'TagCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
