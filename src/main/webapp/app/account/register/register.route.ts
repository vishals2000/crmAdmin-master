import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
    path: 'register',
    component: RegisterComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: 'Registration'
    },
    canActivate: [UserRouteAccessService]
};
