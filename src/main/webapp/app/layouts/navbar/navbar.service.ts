import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BreadCrumbService {
    public breadCrumb = new BehaviorSubject<any[]>([]);
    breadcrumbs = this.breadCrumb.asObservable();
    constructor() { }

    public getBreadCrumbs(): Observable<any[]> {
        return this.breadcrumbs;
    }

    public setBreadCrumbs(obj) {
        this.breadCrumb.next(obj);
    }

    public updateBreadCrumbs(bcArray, cuCrumbobj) {
        let currentIndex;
        for (let i = 0; i < bcArray.length; i++) {
            if (bcArray[i].brdCrmbId === cuCrumbobj.brdCrmbId) {
                if (bcArray[i].router === cuCrumbobj.router) {
                    currentIndex = i + 1;
                } else {
                    currentIndex = i;
                }
            }
        }
        if (bcArray && bcArray.length === 0) {
            if (cuCrumbobj.brdCrmbId === '3' || cuCrumbobj.brdCrmbId === '2') {
                bcArray.push({ name: 'Apps', router: '#/apps', brdCrmbId: '1', appsData: cuCrumbobj.data });
            }
            if (cuCrumbobj.brdCrmbId === '3') {
                bcArray.push({
                    name: cuCrumbobj.appName,
                    router: '#/campaign-group/project/' + cuCrumbobj.appId + '/' + cuCrumbobj.appName,
                    brdCrmbId: '2',
                    appsData: cuCrumbobj.data
                });
            }
        }
        if (currentIndex) {
            bcArray.splice(currentIndex, bcArray.length);
        } else {
            bcArray.push(cuCrumbobj);
        }
    }
}
