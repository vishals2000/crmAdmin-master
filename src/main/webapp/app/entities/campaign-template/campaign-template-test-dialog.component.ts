import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseWrapper } from '../../shared';
import { TEST_URL } from '../../app.constants';

@Component({
    selector: 'jhi-campaign-template-test-dialog',
    templateUrl: './campaign-template-test-dialog.component.html'
})
export class CampaignTemplateTestDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    userName: string;
    isSaving: boolean;

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private http: HttpClient,
        private alertService: JhiAlertService,
    ) {
    }

    ngOnInit() {
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
        });
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmTest(id: string) {
        this.isSaving = true;
        this.campaignTemplateService.getPushNotificationCampaignTemplate(
            {
                campaignTemplateId: id
            }
        ).subscribe(
            (res: ResponseWrapper) => this.onPushNotificationTestTemplate(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    private onPushNotificationTestTemplate(data, headers) {
        data['frontEnd'] = this.campaignTemplate.frontEnd;
        data['product'] = this.campaignTemplate.product;
        data['screenName'] = this.userName;
        data['sendToAllDevices'] = true;
        console.log(data);

        const req = this.http.post(TEST_URL, JSON.stringify(data), {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
            })
        req.subscribe(
            (res: ResponseWrapper) => this.onPushNotificationTestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.activeModal.dismiss(true);
        this.isSaving = false;        
    }

    private onPushNotificationTestSuccess(response, headers) {
        if(response.result) {            
            this.alertService.success(response.message);
        }else {
            this.alertService.error(response.message);
        }
    }
}

@Component({
    selector: 'jhi-campaign-template-test-popup',
    template: ''
})
export class CampaignTemplateTestPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignTemplatePopupService
                .open(CampaignTemplateTestDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
