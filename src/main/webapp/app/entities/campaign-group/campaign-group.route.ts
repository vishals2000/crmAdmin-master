import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CampaignGroupComponent } from './campaign-group.component';
import { CampaignGroupDetailComponent } from './campaign-group-detail.component';
import { CampaignGroupPopupComponent } from './campaign-group-dialog.component';
import { CampaignGroupDeletePopupComponent } from './campaign-group-delete-dialog.component';

@Injectable()
export class CampaignGroupResolvePagingParams implements Resolve<any> {

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

export const campaignGroupRoute: Routes = [
    {
        path: 'campaign-group/project/:id',
        component: CampaignGroupComponent,
        resolve: {
            'pagingParams': CampaignGroupResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        }
    },
    {
        path: 'campaign-group',
        component: CampaignGroupComponent,
        resolve: {
            'pagingParams': CampaignGroupResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'campaign-group/:id',
        component: CampaignGroupDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const campaignGroupPopupRoute: Routes = [
    {
        path: 'campaign-group-new/:projectId',
        component: CampaignGroupPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-group/:id/edit',
        component: CampaignGroupPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-group/:id/delete',
        component: CampaignGroupDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignGroups'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
