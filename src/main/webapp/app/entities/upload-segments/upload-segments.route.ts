import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UploadSegmentsComponent } from './upload-segments.component';
import { UploadSegmentsDetailComponent } from './upload-segments-detail.component';
import { UploadSegmentsPopupComponent } from './upload-segments-dialog.component';
import { UploadSegmentsDeletePopupComponent } from './upload-segments-delete-dialog.component';

@Injectable()
export class UploadSegmentsResolvePagingParams implements Resolve<any> {

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

export const uploadSegmentsRoute: Routes = [
    {
        path: 'upload-segments',
        component: UploadSegmentsComponent,
        resolve: {
            'pagingParams': UploadSegmentsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'UploadSegments'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'upload-segments/:id',
        component: UploadSegmentsDetailComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'UploadSegments'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const uploadSegmentsPopupRoute: Routes = [
    {
        path: 'upload-segments-new',
        component: UploadSegmentsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'UploadSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'upload-segments/:id/edit',
        component: UploadSegmentsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'UploadSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'upload-segments/:id/delete',
        component: UploadSegmentsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'UploadSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
