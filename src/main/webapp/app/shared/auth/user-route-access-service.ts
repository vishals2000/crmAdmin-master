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
        let routerAccessDenied = false;
        let url = state.url;
        url = decodeURI(url);
        if(route.outlet === 'popup'){
            let firstPopUpParam = route.url[0].path;
            if(routerAccess && state.url.indexOf(routerAccess) !== 0 && state.url.indexOf(routerAccess) !==1){
                routerAccessDenied = true;
            } else if(!routerAccess && firstPopUpParam && state.url.indexOf(firstPopUpParam) !== 0 && state.url.indexOf(firstPopUpParam) !==1){
                routerAccessDenied = true;
            }
        } else if(route.url.length === 1){
            if(route.url.length === 1 && route.url[0].path !== state.url && state.url.indexOf('popup:') > -1){
                routerAccessDenied = true;
            }
        }
        return this.checkLogin(authorities, url, routerAccessDenied);
    }

    checkLogin(authorities: string[], url: string, routerAccessDenied: boolean): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (!routerAccessDenied && account && principal.hasAnyAuthorityDirect(authorities)) {
                return true;
            }

            this.stateStorageService.storeUrl(url);

            var event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            var popupClose = document.querySelectorAll('.close') || [];
            for(var i=0;i<popupClose.length;i++){
                popupClose[i].dispatchEvent(event);
            }
            setTimeout(() => {
                this.router.navigate(['accessdenied', { outlets: { popup: null }}], { replaceUrl: true }).then(() => {
                    // only show the login dialog, if the user hasn't logged in yet
                    if (!account) {
                        this.loginModalService.open();
                    }
                    else{
                        
                    }
                });
            }, 100);
            
            return false;
        }));
    }
}
