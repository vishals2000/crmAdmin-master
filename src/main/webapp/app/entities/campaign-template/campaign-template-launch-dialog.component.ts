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
    selector: 'jhi-campaign-template-launch-dialog',
    templateUrl: './campaign-template-launch-dialog.component.html'
})
export class CampaignTemplateLaunchDialogComponent {

    campaignTemplate: CampaignTemplate;

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private http: HttpClient,
        private alertService: JhiAlertService,
    ) {
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
        console.log(data);
        const req = this.http.post('http://trdev-campaign-api-container.ivycomptech.co.in/api/rest/cmsgateway/v1/pushNotificationCampaign',
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
    ) {}

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
