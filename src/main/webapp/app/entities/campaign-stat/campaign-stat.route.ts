import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CampaignStatComponent } from './campaign-stat.component';
import { CampaignStatDetailComponent } from './campaign-stat-detail.component';
import { CampaignStatPopupComponent } from './campaign-stat-dialog.component';
import { CampaignStatDeletePopupComponent } from './campaign-stat-delete-dialog.component';

export const campaignStatRoute: Routes = [
    {
        path: 'campaign-stat',
        component: CampaignStatComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignStats'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'campaign-stat/:id',
        component: CampaignStatDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignStats'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const campaignStatPopupRoute: Routes = [
    {
        path: 'campaign-stat-new',
        component: CampaignStatPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignStats'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-stat/:id/edit',
        component: CampaignStatPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignStats'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'campaign-stat/:id/delete',
        component: CampaignStatDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CampaignStats'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
