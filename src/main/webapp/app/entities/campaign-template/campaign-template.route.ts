import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CampaignTemplateComponent } from './campaign-template.component';
import { CampaignTemplateDetailComponent } from './campaign-template-detail.component';
import { CampaignTemplatePopupComponent } from './campaign-template-dialog.component';
import { CampaignTemplateDeletePopupComponent } from './campaign-template-delete-dialog.component';
import { CampaignTemplateDialogComponent } from './campaign-template-dialog.component';

@Injectable()
export class CampaignTemplateResolvePagingParams implements Resolve<any> {

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

export const campaignTemplateRoute: Routes = [
    {
        path: 'campaign-template',
        component: CampaignTemplateComponent,
        resolve: {
            'pagingParams': CampaignTemplateResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'campaign-template/:id',
        component: CampaignTemplateDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'campaign-template/group/:id',
        component: CampaignTemplateComponent,
        resolve: {
            'pagingParams': CampaignTemplateResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'campaign-template-new',
        component: CampaignTemplateDialogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        // outlet: 'popup'
    }
];

export const campaignTemplatePopupRoute: Routes = [
    {
        path: 'campaign-template/edit/:id',
        component: CampaignTemplateDialogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        // outlet: 'popup'
    },
    {
        path: 'campaign-template/:id/delete',
        component: CampaignTemplateDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
