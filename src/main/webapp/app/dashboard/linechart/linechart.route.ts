import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
import { UserRouteAccessService } from '../../shared';
import { LinechartComponent } from './linechart.component';

export const linechartRoute: Routes = [
    {
        path: 'linechart',
        component: LinechartComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dashboard.linechart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'linechart/project/:id',
        component: LinechartComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dashboard.linechart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'linechart/template/:id',
        component: LinechartComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'dashboard.linechart.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
