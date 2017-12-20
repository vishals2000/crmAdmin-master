import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { Apps } from './apps.model';
import { AppsService } from './apps.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-apps',
    templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit, OnDestroy {

    currentAccount: any;
    apps: Apps[];
    initialApps: Apps[];
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
    searchValue: string;
    constructor(
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
        });
    }
    loadAll(){
        this.appsService.queryAll({}).subscribe(
            (res: ResponseWrapper) => this.eventManager.broadcast({ name: 'appListModified', content: res.json}));
    }
    loadAppPage() {
        if (this.searchValue) {
            this.appsService.search(this.searchValue, {
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
                );
        }
        else {
            this.appsService.query({
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
                );
        }
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/apps'], {
            queryParams:
                {
                    page: (this.page > 0 ? this.page - 1 : this.page),
                    size: this.itemsPerPage,
                    sort: this.sort()
                }
        });
        this.loadAppPage();
    }

    clear() {
        this.page = 0;
        this.transition();
    }
    ngOnInit() {
        this.loadAll();
        this.loadAppPage();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInApps();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
    filterItems($event) {
        if (this.searchValue && this.searchValue !== '' && $event && $event.keyCode === 13) {
            //this.apps = this.initialApps.filter((item) => item.name.toLowerCase().indexOf(this.searchValue) > -1);
            this.page = 0;
            this.appsService.search(this.searchValue, {
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
                );
        }
    }
    onSearchKeyChange(serachVal) {
        if (!serachVal) {
            this.clear();
        }
    }
    trackId(index: number, item: Apps) {
        return item.id;
    }
    registerChangeInApps() {
        this.eventSubscriber = this.eventManager.subscribe('appsListModification', (response) => this.appModification());
    }
    appModification(){
        this.loadAppPage();
        this.loadAll();
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
        this.apps = data;
        this.eventManager.broadcast({ name: 'setBreadCrumbToApp', content: 'OK'});
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
