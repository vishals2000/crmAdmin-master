import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AudienceSegmentsComponent } from './audience-segments.component';
import { AudienceSegmentsDetailComponent } from './audience-segments-detail.component';
import { AudienceSegmentsPopupComponent } from './audience-segments-dialog.component';
import { AudienceSegmentsDeletePopupComponent } from './audience-segments-delete-dialog.component';
import { UploadSegmentsPopupComponent } from './upload-segments-dialog.component';

@Injectable()
export class AudienceSegmentsResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : (route.params['page'] || '1');
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : (route.params['sort'] || 'id,asc');
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const audienceSegmentsRoute: Routes = [
    {
        path: 'audience-segments/project/:id',
        component: AudienceSegmentsComponent,
        resolve: {
            'pagingParams': AudienceSegmentsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'AudienceSegments'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'audience-segments/:id',
        component: AudienceSegmentsDetailComponent,
        resolve: {
            'pagingParams': AudienceSegmentsResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'AudienceSegments'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const audienceSegmentsPopupRoute: Routes = [
    {
        path: 'audience-segments-new',
        component: AudienceSegmentsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'AudienceSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
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
        path: 'audience-segments/:id/edit',
        component: AudienceSegmentsPopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'AudienceSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'audience-segments/:id/delete',
        component: AudienceSegmentsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'AudienceSegments'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
