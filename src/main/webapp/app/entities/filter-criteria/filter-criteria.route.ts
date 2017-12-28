import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { FilterCriteriaComponent } from './filter-criteria.component';
import { FilterCriteriaDetailComponent } from './filter-criteria-detail.component';
import { FilterCriteriaPopupComponent } from './filter-criteria-dialog.component';
import { FilterCriteriaDeletePopupComponent } from './filter-criteria-delete-dialog.component';

export const filterCriteriaRoute: Routes = [
    {
        path: 'filter-criteria',
        component: FilterCriteriaComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FilterCriteria'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'filter-criteria/:id',
        component: FilterCriteriaDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FilterCriteria'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const filterCriteriaPopupRoute: Routes = [
    {
        path: 'filter-criteria-new',
        component: FilterCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FilterCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'filter-criteria/:id/edit',
        component: FilterCriteriaPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FilterCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'filter-criteria/:id/delete',
        component: FilterCriteriaDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FilterCriteria'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
