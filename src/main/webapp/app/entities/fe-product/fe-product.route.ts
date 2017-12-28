import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { FeProductComponent } from './fe-product.component';
import { FeProductDetailComponent } from './fe-product-detail.component';
import { FeProductPopupComponent } from './fe-product-dialog.component';
import { FeProductDeletePopupComponent } from './fe-product-delete-dialog.component';

export const feProductRoute: Routes = [
    {
        path: 'fe-product',
        component: FeProductComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FeProducts'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'fe-product/:id',
        component: FeProductDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FeProducts'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const feProductPopupRoute: Routes = [
    {
        path: 'fe-product-new',
        component: FeProductPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FeProducts'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'fe-product/:id/edit',
        component: FeProductPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FeProducts'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'fe-product/:id/delete',
        component: FeProductDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'FeProducts'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
