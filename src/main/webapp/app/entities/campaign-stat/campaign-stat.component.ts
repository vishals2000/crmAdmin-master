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
    appId: any;
    selectedApp : any;

    constructor(
        private campaignStatService: CampaignStatService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private parseLinks: JhiParseLinks,
        private principal: Principal,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.campaignStats = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
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
        //this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignStats();
        this.eventSubscriber = this.route.params.subscribe((params) => {
            this.appId = params['id'];
            if (this.appId) {
                this.setDataToPageModel();
            }
            else {
                this.eventManager.broadcast({ name: 'setBreadCrumbToCampStatFirstApp', content: 'OK' });
            }
        });
    }
    setDataToPageModel(){
            this.selectedApp = JSON.parse(localStorage['selectedApp']);
            const values: string[] = [this.selectedApp.frontEnd, this.selectedApp.product.toString()];
            setTimeout(() => {
                this.eventManager.broadcast({ name: 'selectedApp', content: this.appId});
                this.eventManager.broadcast({ name: 'setBreadCrumbToCampStat', content: 'OK'});
            }, 0);
            
            if(this.appId){
                this.loadAll();
            }
            else{
                this.clear();
            }
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignStats();
    }
   clear() {
            this.page = 0;
            this.router.navigate(['/campaign-stat/project/' + this.selectedApp.id, {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }]);
            this.loadAll();
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

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.campaignStats = data;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
