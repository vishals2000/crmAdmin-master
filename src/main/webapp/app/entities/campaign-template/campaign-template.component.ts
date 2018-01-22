import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplateService } from './campaign-template.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateDialogComponent } from './campaign-template-dialog.component';

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
    searchValue: string;
    oCampInfo: any;
    copyFromTemp: any;

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
        private http: HttpClient,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.results = [];
        this.searchValue = null;

        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
            this.totalItems = parseInt(this.page) * parseInt(this.itemsPerPage);
        });
    }

    loadAll() {
        if (this.searchValue) {
            this.campaignTemplateService.search({ campGroupId: this.groupId, searchVal: this.searchValue }, {
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => {
                    this.campaignTemplates = [];
                    this.onError(res.json);
                }
                );
        }
        else {
            this.campaignTemplateService.query({
                campGroupId: this.groupId,
                page: (this.page > 0 ? this.page - 1 : this.page),
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => {
                    this.campaignTemplates = [];
                    this.onError(res.json);
                }
                );
        }
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.campaignTemplates = null;
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/campaign-template/group', this.groupId , this.groupName], {
            queryParams:
                {
                    page: this.page,
                    size: this.itemsPerPage,
                    sort: this.sort()
                }
        });
        this.loadAll();
    }

    clear() {
        this.page = 1;
        this.transition();
    }
    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCampaignTemplates();
        this.subscription = this.route.params.subscribe((params) => {
            setTimeout(() => {
                this.groupId = params['id'];
                this.groupName = params['name'];
                this.loadAll();
                if (sessionStorage["selectedApp"]) {
                    const fePdTde = JSON.parse(sessionStorage["selectedApp"]);
                    const values: string[] = [this.groupId, fePdTde.frontEnd, fePdTde.product];
                    this.campaignTemplateService.changeMessage(values);
                } else {
                    this.campaignTemplateService.getFeProduct(this.groupId, 'feProduct').subscribe((response) => {
                        const values: string[] = [this.groupId, response['fe'], response['product']];
                        this.campaignTemplateService.changeMessage(values);
                    });
                }
            });
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
            this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        return result;
    }

    filterItems($event) {
        if (this.searchValue && this.searchValue !== '' && $event && $event.keyCode === 13) {
            this.page = 1;
            this.campaignTemplateService.search({ campGroupId: this.groupId, searchVal: this.searchValue }, {
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
    copyOrRetargetCurrentTemp(copyFromTemp, bIsRetarget) {
        console.log(copyFromTemp);
        this.copyFromTemp = copyFromTemp;
        this.campaignTemplateService.search({ campGroupId: this.groupId, searchVal: copyFromTemp.campaignName }, {}).subscribe(
            (res: ResponseWrapper) => this.copyCurrentIrmWithCopyCount(res.json, bIsRetarget),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    openCampaignTempPage(campTempId) {
        this.campaignTemplatePopupService.openWithoutRouter(CampaignTemplateDialogComponent as Component, {}, false, campTempId);
    }
    copyCurrentIrmWithCopyCount(acampaigns, bIsRetarget) {
        let count = 0;
        let copOrRetagTxt = bIsRetarget ? 'Retarget from ' : '(Copy ';
        let copyRertaEndSplitTxt = bIsRetarget ? '-' : ')';
        if (acampaigns.length === 1) {
            this.campaignTemplateService.copyorRetargetCampaignTemplate(this.copyFromTemp, 0, bIsRetarget).subscribe(
                (res: ResponseWrapper) => this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' }),
                (res: Response) => this.OnSaveError(res)
            );
        }
        else {
            let copyCountArr = [];
            for (var i = 0; i < acampaigns.length; i++) {
                if (acampaigns[i].campaignName.indexOf(copOrRetagTxt) > -1) {
                    let aSubName = acampaigns[i].campaignName.split(copOrRetagTxt);
                    if (aSubName.length) {
                        aSubName.splice(0, 1);
                        aSubName = aSubName.join(copOrRetagTxt);
                        if (aSubName.indexOf(copyRertaEndSplitTxt) > -1) {
                            let aActualCapName = aSubName.split(copyRertaEndSplitTxt);
                            const copyCountNo = aActualCapName.splice(0, 1);
                            aActualCapName = aActualCapName.join(copyRertaEndSplitTxt);
                            if (aActualCapName === this.copyFromTemp.campaignName) {
                                count++;
                                if (copyCountNo[0] && !isNaN(copyCountNo[0])) {
                                    copyCountArr.push(parseInt(copyCountNo[0] || 0));
                                }
                            }
                        }
                    }
                }
            }
            copyCountArr.sort();
            if (count > 0) {
                count = (copyCountArr[copyCountArr.length - 1] || 0) + 1;
            }
            this.campaignTemplateService.copyorRetargetCampaignTemplate(this.copyFromTemp, count, bIsRetarget).subscribe(
                (res: ResponseWrapper) => this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' }),
                (res: Response) => this.OnSaveError(res)
            );
        }
    }
    openLaunchPopup(campaignTemp){
        if(campaignTemp.retargetedCampaign && campaignTemp.targetGroupContentCriteria && (!campaignTemp.targetGroupContentCriteria.length || (campaignTemp.targetGroupContentCriteria.length && !campaignTemp.targetGroupContentCriteria[0].contentBody || !campaignTemp.targetGroupContentCriteria[0].contentTitle))){
            this.openCampaignTempPage(campaignTemp.id);
        }
        else{
            this.router.navigate(['/', { outlets: { popup: 'campaign-template/'+ campaignTemp.id + '/launch'} }], {});
        }
    }
    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        this.campaignTemplates = data || [];

        const fePdTde = JSON.parse(sessionStorage["selectedApp"] || null);
        if (this.previousPage === 1 && this.searchValue === null && !this.oCampInfo && !fePdTde) {
            this.campaignTemplateService.getAppCapGrpIdFromCapGrp(this.groupId).subscribe((oCampGrpInfo) => {
                this.oCampInfo = oCampGrpInfo;
                this.eventManager.broadcast({ name: 'setBreadCrumbToCampTemp', content: { campGrpId: this.groupId, appId: this.oCampInfo.appId } });
            });
        } else if (fePdTde) {
            this.oCampInfo = {
                "appId": fePdTde.id,
                "appName": fePdTde.name,
                "campaignGroupId": this.groupId,
                "campaignGroupName": ''
            };
            this.eventManager.broadcast({ name: 'setBreadCrumbToCampTemp', content: { campGrpId: this.groupId, appId: this.oCampInfo.appId } });
        }
    }

    private OnSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}