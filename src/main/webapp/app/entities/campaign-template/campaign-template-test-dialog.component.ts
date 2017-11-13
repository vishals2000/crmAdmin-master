import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseWrapper } from '../../shared';
import { LAUNCH_URL } from '../../app.constants';

@Component({
    selector: 'jhi-campaign-template-test-dialog',
    templateUrl: './campaign-template-test-dialog.component.html'
})
export class CampaignTemplateLaunchDialogComponent implements OnInit {

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

    confirmLaunch(id: string) {
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

        const req = this.http.post(LAUNCH_URL,
            JSON.stringify(data), {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
            })
        req.subscribe();
        this.activeModal.dismiss(true);
    }
}

@Component({
    selector: 'jhi-campaign-template-launch-popup',
    template: ''
})
export class CampaignTemplateLaunchPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignTemplatePopupService
                .open(CampaignTemplateLaunchDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
