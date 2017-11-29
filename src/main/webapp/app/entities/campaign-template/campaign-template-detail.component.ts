import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplateService } from './campaign-template.service';
import { BreadCrumbService } from '../../layouts/navbar/navbar.service';

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
        public breadCrumbService: BreadCrumbService
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
        this.breadCrumbService.getBreadCrumbs().subscribe(breadCrumbArray => {
            if (breadCrumbArray && breadCrumbArray.length < 2) {
                this.campaignTemplateService.getAppCapGrpIdFromTemp(this.campaignTemplate.id).subscribe((oCampTempInfo) => {
                    this.oCampInfo = oCampTempInfo;
                    this.breadCrumbService.updateBreadCrumbs(breadCrumbArray, { name: this.oCampInfo.campaignGroupName, router: '#/campaign-template/group/' + this.oCampInfo.campaignGroupId + '/' + this.oCampInfo.campaignGroupName, brdCrmbId: '3', appId: this.oCampInfo.appId, appName: this.oCampInfo.appName });
                });
            }
            else {
                // this.breadCrumbService.updateBreadCrumbs(breadCrumbArray, {name : this.campaignTemplate.campaignGroupId, router : '#/campaign-template/group/' + this.campaignTemplate.campaignGroupId  + "/" + this.campaignTemplate.campaignName, brdCrmbId : '3'});
            }
        });
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
