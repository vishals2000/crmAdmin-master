import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplateService } from './campaign-template.service';
//import { BreadCrumbService } from '../../layouts/navbar/navbar.service';

@Component({
    selector: 'jhi-campaign-template-detail',
    templateUrl: './campaign-template-detail.component.html'
})
export class CampaignTemplateDetailComponent implements OnInit, OnDestroy {

    campaignTemplate: CampaignTemplate;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    data: any;
    oCampInfo: any;
    constructor(
        private eventManager: JhiEventManager,
        private campaignTemplateService: CampaignTemplateService,
        private route: ActivatedRoute,
        //public breadCrumbService: BreadCrumbService
    ) {
        this.data = {
            labels: ['A', 'B', 'C'],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCampaignTemplates();
    }

    load(id) {
        this.campaignTemplateService.find(id).subscribe((campaignTemplate) => {
            this.campaignTemplate = campaignTemplate;
            this.renderBreadcrumb();
        });

    }

    renderBreadcrumb() {
        this.eventSubscriber = this.eventManager.subscribe('campGrpDataReady', response => this.callBreadCrumbToCampTemp(response));//handling refresh scenario
        this.campaignTemplateService.getAppCapGrpIdFromTemp(this.campaignTemplate.id).subscribe((oCampTempInfo) => {
            this.oCampInfo = oCampTempInfo;
            this.eventManager.broadcast({ name: 'selectedApp', content: this.oCampInfo.appId});
            this.eventManager.broadcast({ name: 'selectedCampGrp', content: this.oCampInfo.campaignGroupId});
            this.eventManager.broadcast({ name: 'setBreadCrumbToCampTemp', content: {campGrpId : this.oCampInfo.campaignGroupId}});
        });
    }
    private callBreadCrumbToCampTemp(response){
        this.eventManager.broadcast({ name: 'setBreadCrumbToCampTemp', content: {campGrpId : this.campaignTemplate.campaignGroupId}});
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCampaignTemplates() {
        this.eventSubscriber = this.eventManager.subscribe(
            'campaignTemplateListModification',
            (response) => this.load(this.campaignTemplate.id)
        );
    }
}
