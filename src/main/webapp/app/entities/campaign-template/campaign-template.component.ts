import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplateService } from './campaign-template.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'jhi-campaign-template',
    templateUrl: './campaign-template.component.html'
})
export class CampaignTemplateComponent implements OnInit, OnDestroy {

    currentAccount: any;
    campaignTemplates: CampaignTemplate[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    private subscription: Subscription;

    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    results: string[];
    groupId: string;
    groupName: string;
    constructor(
        private campaignTemplateService: CampaignTemplateService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,

        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private http: HttpClient

    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.results = [];

        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
    }

    loadAll() {
        this.campaignTemplateService.query({
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
        this.router.navigate(['/campaign-template'], {
            queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/campaign-template', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        // this.campaignTemplateService.cuttentMesage.subscribe((message) => this.groupId = message);
        // this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignTemplates();
        this.subscription = this.route.params.subscribe((params) => {
            this.groupId = params['id'];
            this.groupName = params['name'];

            this.campaignTemplateService.getFeProduct(this.groupId, 'feProduct').subscribe((response) => {
                const values: string[] = [this.groupId, response['fe'], response['product']]
                this.campaignTemplateService.changeMessage(values);
            });
            this.load1(this.groupId);
        });
    }

    load1(id) {
        this.campaignTemplateService.findCampGroups(id, 'group').subscribe((data) => {
            this.campaignTemplates = data;
        },
            (err) => {
                // alert(err);
                console.log(err);
                // this.campaignTemplates = [{
                //     'id': '59f47d8513b80ad7286ec255',
                //     'campaignName': 'Partypoker App',
                //     'campaignDescription': 'This is Partypoker application'
                // },
                // {
                //     'id': '59f47d8513b80ad7286ec255',
                //     'campaignName': 'Partypoker App',
                //     'campaignDescription': 'This is Partypoker application'
                // },
                // {
                //     'id': '59f47d8513b80ad7286ec255',
                //     'campaignName': 'Partypoker App',
                //     'campaignDescription': 'This is Partypoker application'
                // },
                // {
                //     'id': '59f47d8513b80ad7286ec255',
                //     'campaignName': 'Partypoker App',
                //     'campaignDescription': 'This is Partypoker application'
                // }]
            });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CampaignTemplate) {
        return item.id;
    }
    registerChangeInCampaignTemplates() {
        this.eventSubscriber = this.eventManager.subscribe('campaignTemplateListModification', (response) =>
            this.load1(this.groupId));
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
        this.campaignTemplates = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
