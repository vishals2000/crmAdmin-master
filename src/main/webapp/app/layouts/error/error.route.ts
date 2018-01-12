import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
    {
        path: 'error',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'Error page!',
            routeAccessToPage:'accessdenied'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'accessdenied',
        component: ErrorComponent,
        data: {
            authorities: [],
            pageTitle: 'Error page!',
            error403: true,
            routeAccessToPage:'accessdenied'
        },
        canActivate: [UserRouteAccessService],
    }
];
