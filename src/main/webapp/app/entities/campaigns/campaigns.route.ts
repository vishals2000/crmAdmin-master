import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CampaignsComponent } from './campaigns.component';
import { CampaignsDetailComponent } from './campaigns-detail.component';
import { CampaignsPopupComponent } from './campaigns-dialog.component';
import { CampaignsDeletePopupComponent } from './campaigns-delete-dialog.component';

@Injectable()
export class CampaignsResolvePagingParams implements Resolve<any> {

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

export const campaignsRoute: Routes = [
    {
        path: 'campaigns',
        component: CampaignsComponent,
        resolve: {
            'pagingParams': CampaignsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Campaigns'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'campaigns/:id',
        component: CampaignsDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Campaigns'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const campaignsPopupRoute: Routes = [
    {
        path: 'campaigns-new',
        component: CampaignsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Campaigns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaigns/:id/edit',
        component: CampaignsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Campaigns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaigns/:id/delete',
        component: CampaignsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Campaigns'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
