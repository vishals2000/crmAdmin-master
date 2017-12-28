import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';
import { LinechartComponent } from './linechart.component';

@Injectable()
export class LinechartResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const segName = route.queryParams['segName'] ? route.queryParams['segName'] : (route.params['segName'] || '');
        return {
            segName: this.paginationUtil.parsePredicate(segName)
      };
    }
}

export const linechartRoute: Routes = [
    {
        path: 'linechart',
        component: LinechartComponent,
        resolve: {
            'pagingParams': LinechartResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'Insights'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'linechart/project/:id',
        component: LinechartComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'dashboard.linechart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'linechart/template/:id',
        component: LinechartComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'dashboard.linechart.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
