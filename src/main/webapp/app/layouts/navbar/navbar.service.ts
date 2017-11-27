import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BreadCrumbService {
    public breadCrumb = new BehaviorSubject<any[]>([]);
    breadcrumbs = this.breadCrumb.asObservable();
    constructor() { }

    public getBreadCrumbs() : Observable<any[]>{
        return this.breadcrumbs;
    }

    public setBreadCrumbs(obj){
        this.breadCrumb.next(obj);
    }

    public updateBreadCrumbs(bcArray, cuCrumbobj){
        console.log(bcArray);
        let currentIndex;
        for(let i=0; i< bcArray.length; i++){
            if(bcArray[i].brdCrmbId === cuCrumbobj.brdCrmbId)
            {
                if(bcArray[i].router === cuCrumbobj.router){
                    currentIndex = i  + 1;
                }
                else{
                    currentIndex = i;
                }
            }
        }
        if(currentIndex){
            bcArray.splice(currentIndex, bcArray.length);
        }
        else{
            if(bcArray && bcArray.length){
                cuCrumbobj.list = bcArray[bcArray.length - 1].appsData;
                cuCrumbobj.selVal = cuCrumbobj.key;
            }
            bcArray.push(cuCrumbobj);
        }
    }
}
