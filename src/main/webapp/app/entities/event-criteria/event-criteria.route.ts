import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EventCriteriaComponent } from './event-criteria.component';
import { EventCriteriaDetailComponent } from './event-criteria-detail.component';
import { EventCriteriaPopupComponent } from './event-criteria-dialog.component';
import { EventCriteriaDeletePopupComponent } from './event-criteria-delete-dialog.component';

@Injectable()
export class EventCriteriaResolvePagingParams implements Resolve<any> {

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

export const eventCriteriaRoute: Routes = [
    {
        path: 'event-criteria',
        component: EventCriteriaComponent,
        resolve: {
            'pagingParams': EventCriteriaResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'EventCriteria'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'event-criteria/:id',
        component: EventCriteriaDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'EventCriteria'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventCriteriaPopupRoute: Routes = [
    {
        path: 'event-criteria-new',
        component: EventCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'EventCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-criteria/:id/edit',
        component: EventCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'EventCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-criteria/:id/delete',
        component: EventCriteriaDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'EventCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
