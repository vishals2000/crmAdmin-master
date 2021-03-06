import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { CampaignGroup } from './campaign-group.model';
import { CampaignGroupService } from './campaign-group.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
// import { BreadCrumbService } from '../../layouts/navbar/navbar.service';

@Component({
    selector: 'jhi-campaign-group',
    templateUrl: './campaign-group.component.html'
})
export class CampaignGroupComponent implements OnInit, OnDestroy {

    currentAccount: any;
    campaignGroups: CampaignGroup[];
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
    projectId: string;
    projectName: string;
    searchValue: string;
    pageLoadWithParam: boolean;
    constructor(
        private campaignGroupService: CampaignGroupService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        // public breadCrumbService: BreadCrumbService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.searchValue = null;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
            this.pageLoadWithParam = true;
        });
    }
    // loadAll() {
    //     this.campaignGroupService.queryAll({ appId: this.projectId }).subscribe(
    //         (res: ResponseWrapper) => this.eventManager.broadcast({ name: 'campaignGroupListModified', content: res.json }));
    // }

    loadAppPage() {
        if (this.searchValue) {
            this.campaignGroupService.search({ appId: this.projectId, searchVal: this.searchValue }, {
                appId: this.projectId,
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => {
                        this.campaignGroups = [];
                        this.onError(res.json)
                    }
                );
        } else {
            this.campaignGroupService.query({
                appId: this.projectId,
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => {
                    this.campaignGroups = [];
                    this.onError(res.json)
                }
                );
        }
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.campaignGroups = null;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/campaign-group/project', this.projectId, this.projectName], {
            queryParams:
                {
                    page: this.page,
                    size: this.itemsPerPage,
                    sort: this.sort()
                }
        });
        this.loadAppPage();
    }

    clear() {
        this.page = 1;
        this.transition();
    }
    ngOnInit() {
        // this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignGroups();
        this.subscription = this.route.params.subscribe((params) => {
            setTimeout(() => {
                this.projectId = params['id'];
                this.projectName = params['name'];
                // if (this.page === 1 && !this.searchValue) {
                //     this.loadAll();
                // }
                this.loadAppPage();
                this.pageLoadWithParam = false;
                this.campaignGroupService.changeGroupId(this.projectId);
            }, 0);
        });
    }
    //     load1(id) {
    //         this.campaignGroupService.findProjects(id, 'project', ).subscribe((data) => {
    //              this.campaignGroups = data;
    //        },
    //        (err) => {
    //            alert('error');
    //            this.campaignGroups = [{
    //                        'id' : '59f47d8513b80ad7286ec255',
    //                        'name' : 'Partypoker App',
    //                        'description' : 'This is Partypoker application'
    //                      },
    //                      {
    //                         'id' : '59f47d8513b80ad7286ec255',
    //                         'name' : 'Partypoker App',
    //                         'description' : 'This is Partypoker application'
    //                       },
    //                       {
    //                         'id' : '59f47d8513b80ad7286ec255',
    //                         'name' : 'Partypoker App',
    //                         'description' : 'This is Partypoker application'
    //                       },
    //                       {
    //                         'id' : '59f47d8513b80ad7286ec255',
    //                         'name' : 'Partypoker App',
    //                         'description' : 'This is Partypoker application'
    //                       }]
    //             });
    //    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.subscription);
    }

    trackId(index: number, item: CampaignGroup) {
        return item.id;
    }
    registerChangeInCampaignGroups() {
        this.eventSubscriber = this.eventManager.subscribe('campaignGroupListModification', (response) => this.capmnGrpModification());
    }
    capmnGrpModification() {
       // this.loadAll();
        this.loadAppPage();
    }
    filterItems($event) {
        if (this.searchValue && this.searchValue !== '' && $event && $event.keyCode === 13) {
            this.page = 1;
            this.campaignGroupService.search({ appId: this.projectId, searchVal: this.searchValue }, {
                appId: this.projectId,
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
        this.campaignGroups = data || [];
        this.eventManager.broadcast({ name: 'setBreadCrumbToCampGrp', content: {appId: this.projectId} });
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
        this.eventManager.broadcast({ name: 'setBreadCrumbToCampGrp', content: {appId: this.projectId} });
    }
}
