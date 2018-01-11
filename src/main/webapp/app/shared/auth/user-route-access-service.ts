import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Principal } from '../';
import { LoginModalService } from '../login/login-modal.service';
import { StateStorageService } from './state-storage.service';

@Injectable()
export class UserRouteAccessService implements CanActivate {

    constructor(private router: Router,
                private loginModalService: LoginModalService,
                private principal: Principal,
                private stateStorageService: StateStorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {

        const authorities = route.data['authorities'];
        const routerAccess = route.data['routeAccessToPage'];
        if (!authorities || authorities.length === 0) {
            return true;
        }
        let url = state.url;
        url = decodeURI(url);
        if(route.outlet === 'popup'){
            let urlSub;
            for(let i=0;i<route.url.length;i++){
                if(!urlSub){
                    urlSub = route.url[i].path;
                }else{
                    urlSub = urlSub + "/" +  route.url[i].path;
                }
               
            }
            url = url.replace("(popup:" + decodeURI(urlSub) + ")", '');
        } else if(route.url.length){
            url = route.url[0].path;
        } else{
            url = state.url;
        }
        return this.checkLogin(authorities, url, routerAccess);
    }

    checkLogin(authorities: string[], url: string, routerAccess: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (account && principal.hasAnyAuthorityDirect(authorities)) {
                if(routerAccess && (url.indexOf(routerAccess) !== 0 && url.indexOf(routerAccess) !== 1)){
                    this.router.navigate(['apps']);
                    return false;
                }
                return true;
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['accessdenied']).then(() => {
                // only show the login dialog, if the user hasn't logged in yet
                if (!account) {
                    this.loginModalService.open();
                }
            });
            return false;
        }));
    }
}
