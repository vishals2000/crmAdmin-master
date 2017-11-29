import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { CampaignGroup } from './campaign-group.model';
import { CampaignGroupService } from './campaign-group.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { BreadCrumbService } from '../../layouts/navbar/navbar.service';

@Component({
    selector: 'jhi-campaign-group',
    templateUrl: './campaign-group.component.html'
})
export class CampaignGroupComponent implements OnInit, OnDestroy {

    currentAccount: any;
    campaignGroups: CampaignGroup[];
    initialCampainGroups: CampaignGroup[];
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
        public breadCrumbService : BreadCrumbService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
    }

    loadAll() {
        this.campaignGroupService.query({
            appId: this.projectId,
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers, false),
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
        this.router.navigate(['/campaign-group/project/' + this.projectId + '/' + this.projectName], {
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
        this.router.navigate(['/campaign-group', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        // this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignGroups();
        this.subscription = this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.projectName = params['name'];
            this.loadAll();
            this.campaignGroupService.changeGroupId(this.projectId);
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
    }

    trackId(index: number, item: CampaignGroup) {
        return item.id;
    }
    registerChangeInCampaignGroups() {
        this.eventSubscriber = this.eventManager.subscribe('campaignGroupListModification', (response) =>
            this.loadAll()
        );
    }
    filterItems($event) {
        if (this.searchValue && this.searchValue !== '' && $event && $event.keyCode === 13) {
            //this.campaignGroups = this.initialCampainGroups.filter((item) => item.name.toLowerCase().indexOf(this.searchValue) > -1);
            this.campaignGroupService.search({appId: this.projectId, searchVal : this.searchValue}).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers, true),
                (res: ResponseWrapper) => this.onError(res.json)
                );
        } else {
            this.campaignGroups = this.initialCampainGroups;
        }
    }
    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers, bIsFromSearch) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.campaignGroups = data;
        if(!bIsFromSearch){
            this.initialCampainGroups = data;
        }
        this.breadCrumbService.getBreadCrumbs().subscribe(val=>{
            this.breadCrumbService.updateBreadCrumbs(val, {name : this.projectName, router : '#/campaign-group/project/' + this.projectId  + "/" + this.projectName, brdCrmbId : '2'});
        });
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
