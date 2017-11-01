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
            sort: this.sort()}).subscribe(
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
        this.router.navigate(['/campaign-template'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    runCampaign(campaignTemplate) {
        this.campaignTemplateService.getPushNotificationCampaignTemplate(
            {
                campaignTemplateId: campaignTemplate.id
            }
        ).subscribe(
            (res: ResponseWrapper) => this.onPushNotificationCampaignTemplate(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    testHttpCall() {
        const body = '{ "product" : "POKER",' +
        '"frontEnd" :"pp",' +
        '"campaignName" :"testCampaignName",' +
        '"campaignDescription" :"testCampaignDescription",' +
        '"filterCriteria" : [{"field" : "key1", "op":"in", "value":"value1"}],' +
        '"recurrenceDetail" : {"startDate" : "2017-09-26", "recurrenceEndDate" : "2017-09-29", "recurrenceType" : "NONE"},' +
        '"messageContentList" : [ {"contentName" : "contentNameOne",' +
                                    '"contentTitle" : "contentTitleOne",' +
                                    '"contentBody" : "contentBodyOne",' +
                                    '"metaData" : {"metaKey1" :"metaValue1", "metaKey2" :"metaValue2"},' +
                                    '"scheduledTime" : "2017-09-26 06:07:19",' +
                                    '"inPlayerTimezone" : "true",' +
                                    '"filterCriteria" : {"key1" : "value1", "key3":"value3" }},' +
                                    '{"contentName" : "contentNameTwo", ' +
                                    '"contentTitle" : "contentTitleTwo",' +
                                    '"contentBody" : "contentBodyTwo",' +
                                    '"metaData" : {"metaKey3" :"metaValue3", "metaKey4" :"metaValue4"},' +
                                    '"scheduledTime" : "2017-09-26 06:07:19",' +
                                    '"inPlayerTimezone" : "false",' +
                                    '"filterCriteria" : {"key1" : "value1", "key4":"value4", "key5":"value5" }}]}'
        // this.http.get('http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/getCampaignMetaData').subscribe((data) => console.log(data))
        const req = this.http.post('http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/pushNotificationCampaign', body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
          })
        req.subscribe();
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
        // alert('asfsadfsa');
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignTemplates();
        this.subscription = this.route.params.subscribe((params) => {
            this.load1(params['id']);
            this.groupId = params['id'];
        });
    }

    load1(id) {
    // alert(id);
     this.campaignTemplateService.findCampGroups(id, 'group').subscribe((data) => {
          this.campaignTemplates = data;
         // alert(data);
    },
    (err) => {
        alert('error');
        this.campaignTemplates = [{
                    'id' : '59f47d8513b80ad7286ec255',
                    'campaignName' : 'Partypoker App',
                    'campaignDescription' : 'This is Partypoker application'
                  },
                  {
                     'id' : '59f47d8513b80ad7286ec255',
                     'campaignName' : 'Partypoker App',
                     'campaignDescription' : 'This is Partypoker application'
                   },
                   {
                     'id' : '59f47d8513b80ad7286ec255',
                     'campaignName' : 'Partypoker App',
                     'campaignDescription' : 'This is Partypoker application'
                   },
                   {
                     'id' : '59f47d8513b80ad7286ec255',
                     'campaignName' : 'Partypoker App',
                     'campaignDescription' : 'This is Partypoker application'
                   }]
         });
}

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CampaignTemplate) {
        return item.id;
    }
    registerChangeInCampaignTemplates() {
        this.eventSubscriber = this.eventManager.subscribe('campaignTemplateListModification', (response) => this.loadAll());
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

    private onPushNotificationCampaignTemplate(data, headers) {
        console.log(data);
        const req = this.http.post('http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/pushNotificationCampaign',
        JSON.stringify(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
          })
        req.subscribe();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
