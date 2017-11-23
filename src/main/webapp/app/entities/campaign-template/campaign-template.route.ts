import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CampaignTemplateComponent } from './campaign-template.component';
import { CampaignTemplateDetailComponent } from './campaign-template-detail.component';
import { CampaignTemplatePopupComponent } from './campaign-template-dialog.component';
import { CampaignTemplateDeletePopupComponent } from './campaign-template-delete-dialog.component';
import { CampaignTemplateLaunchPopupComponent } from './campaign-template-launch-dialog.component';
import { CampaignTemplateTestPopupComponent } from './campaign-template-test-dialog.component';
import { CampaignTemplateCancelPopupComponent } from './campaign-template-cancel-dialog.component';

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
        path: 'campaign-template/group/:id/:name',
        component: CampaignTemplateComponent,
        resolve: {
            'pagingParams': CampaignTemplateResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        }
    },
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
    }
];

export const campaignTemplatePopupRoute: Routes = [
    {
        path: 'campaign-template-new',
        component: CampaignTemplatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-template/:id/edit',
        component: CampaignTemplatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
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
    },
    {
        path: 'campaign-template/:id/launch',
        component: CampaignTemplateLaunchPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-template/:id/test',
        component: CampaignTemplateTestPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-template/:id/cancel',
        component: CampaignTemplateCancelPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignTemplates'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
