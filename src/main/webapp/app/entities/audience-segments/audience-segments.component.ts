import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { AudienceSegments } from './audience-segments.model';
import { AudienceSegmentsService } from './audience-segments.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { AppsService } from '../../entities/apps/apps.service';
import { Apps } from '../../entities/apps/apps.model';

@Component({
    selector: 'jhi-audience-segments',
    templateUrl: './audience-segments.component.html'
})
export class AudienceSegmentsComponent implements OnInit, OnDestroy {

    currentAccount: any;
    audienceSegments: AudienceSegments[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    apps: Apps[];
    showUploadDiv: boolean;
    selectedApp: any;
    segName: any;

    constructor(
        private audienceSegmentsService: AudienceSegmentsService,
        private appsService: AppsService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
            this.segName = data['pagingParams'].segName;
        });
    }

    loadAll() {
        this.audienceSegmentsService.query({
            frontEnd: this.selectedApp.frontEnd,
            product: this.selectedApp.product
        }, {
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/audience-segments'], {
            queryParams:
                {
                    page: this.page,
                    size: this.itemsPerPage,
                    sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
                    segName : this.selectedApp.frontEnd
                }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/audience-segments', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
            segName : this.selectedApp.frontEnd
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.showUploadDiv = false
        this.appsService.query().subscribe((res: ResponseWrapper) => {
            this.apps = res.json;
            if(!this.segName){
                this.selectedApp = this.apps[0];
            }
            else{
                for(let i=0;i<this.apps.length;i++){
                    if(this.apps[i].frontEnd === this.segName){
                        this.selectedApp = this.apps[i];
                        break;
                    }
                }
            }
            this.showUploadDiv = true;
            const values: string[] = [this.selectedApp.frontEnd, this.selectedApp.product.toString()];
            this.audienceSegmentsService.changeAppInfo(values);
            if(this.segName){
                this.loadAll();
            }
            else{
                this.clear();
            }
        });
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInAudienceSegments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AudienceSegments) {
        return item.id;
    }
    registerChangeInAudienceSegments() {
        this.eventSubscriber = this.eventManager.subscribe('audienceSegmentsListModification', (response) => this.loadAll());
    }

    getData(app: Apps) {
        if (app) {
            this.showUploadDiv = true;
            const values: string[] = [app.frontEnd, app.product.toString()];
            this.audienceSegmentsService.changeAppInfo(values);
            this.clear();
            //this.loadAll();
            // alert(app.product.toString()  + '   --  ' + app.frontEnd);
        } else {
            console.log(app);
            this.alertService.error('Please select app from drop down list');
        }
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.audienceSegments = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
