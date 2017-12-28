import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { CampaignStat } from './campaign-stat.model';
import { CampaignStatService } from './campaign-stat.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-campaign-stat',
    templateUrl: './campaign-stat.component.html'
})
export class CampaignStatComponent implements OnInit, OnDestroy {

    campaignStats: CampaignStat[];
    currentAccount: any;
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    reverse: any;
    totalItems: number;
    selectedApp: any;
    allApps: any;
    campStatDt: any;
    searchValue: any;
    previousPage: any;

    constructor(
        private campaignStatService: CampaignStatService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private parseLinks: JhiParseLinks,
        private principal: Principal
    ) {
        this.campaignStats = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.previousPage = 1;
        this.predicate = 'id';
        this.reverse = true;
    }

    loadAll() {
        this.campaignStatService.query({
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    reset() {
        this.page = 0;
        this.campaignStats = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }
    ngOnInit() {
        const dateObj = new Date();
        const todayDt1 = {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate()
        };
        this.campStatDt = todayDt1;
        this.allApps = JSON.parse(localStorage['appList']) || [];
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignStats();
    }
    setDataToPageModel() {
        this.selectedApp = JSON.parse(localStorage['selectedApp']);
        const values: string[] = [this.selectedApp.frontEnd, this.selectedApp.product.toString()];
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignStats();
    }
    getCampaignStatDetails() {

    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CampaignStat) {
        return item.id;
    }
    registerChangeInCampaignStats() {
        this.eventSubscriber = this.eventManager.subscribe('campaignStatListModification', (response) => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    onDtChange() {

    }

    onAppSelect() {

    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.campaignStats = data;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
