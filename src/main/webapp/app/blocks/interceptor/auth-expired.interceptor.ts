import { JhiHttpInterceptor } from 'ng-jhipster';
import { RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';
import { LoginService } from '../../shared/login/login.service';

export class AuthExpiredInterceptor extends JhiHttpInterceptor {
    requestCount: any;
    constructor(private injector: Injector) {
        super();
        this.requestCount = 0;
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        this.requestCount = this.requestCount + 1;
        this.showBusyInd();
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        this.requestCount = this.requestCount - 1;
        this.hideBusyInd();
        return <Observable<Response>>observable.catch((error, source) => {
            if (error.status === 401) {
                const loginService: LoginService = this.injector.get(LoginService);
                loginService.logout();
            }
            return Observable.throw(error);
        });
    }

    showBusyInd() {
        if (this.requestCount > 0) {
            let loadIOndCss = document.getElementById("loadingIndicatorCss");
            if (loadIOndCss) {
                loadIOndCss.classList.add("d-block");
                loadIOndCss.classList.remove("d-none");
            }
        }
        else {
            this.hideBusyInd();
        }
    }

    hideBusyInd() {
        if (this.requestCount <= 0) {
            setTimeout(() => {
                let loadIOndCss = document.getElementById("loadingIndicatorCss");
                if (loadIOndCss) {
                    loadIOndCss.classList.remove("d-block");
                    loadIOndCss.classList.add("d-none");
                }
            }, 100);
        }
    }
}
