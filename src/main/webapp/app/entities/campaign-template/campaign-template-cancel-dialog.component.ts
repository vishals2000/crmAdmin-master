import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-campaign-template-cancel-dialog',
    templateUrl: './campaign-template-cancel-dialog.component.html'
})
export class CampaignTemplateCancelDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
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
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmCancel(id: string) {
        this.campaignTemplateService.getPushNotificationCampaignTemplate(
            {
                campaignTemplateId: id
            }
        ).subscribe(
            (res: ResponseWrapper) => this.onPushNotificationCampaignTemplate(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    private onPushNotificationCampaignTemplate(data, headers) {
        data['frontEnd'] = this.campaignTemplate.frontEnd;
        data['product'] = this.campaignTemplate.product;
        console.log(data);

        this.campaignTemplateService.cancelPushNotification(data).subscribe(
            (res: ResponseWrapper) => this.onPushNotificationCancelSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.activeModal.dismiss(true);
    }

    private onPushNotificationCancelSuccess(response, headers) {
        if (response.result) {
            this.alertService.success(response.message);
        }else {
            this.alertService.error(response.message);
        }
        
        /*
        this.campaignTemplateService.updateCancelStatus (
            {
                campaignTemplateId: this.campaignTemplate.id,
                status : response.result,
                method : 'updateCancelStatus'
            }
        ).subscribe(
            (res: ResponseWrapper) => {
                alert(res);
                this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
            },
            (res: ResponseWrapper) => this.onError(res.json)
            );
            */
    }
}

@Component({
    selector: 'jhi-campaign-template-cancel-popup',
    template: ''
})
export class CampaignTemplateCancelPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignTemplatePopupService
                .open(CampaignTemplateCancelDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
