import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { ResponseWrapper } from '../../shared';
import { Observable } from 'rxjs/Rx';



@Component({
    selector: 'jhi-campaign-template-delete-dialog',
    templateUrl: './campaign-template-delete-dialog.component.html'
})
export class CampaignTemplateDeleteDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
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
    confirmDelete(id: string) {
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

        this.campaignTemplateService.deletePushNotificationCampaign(data).subscribe(
            (res: ResponseWrapper) => {
                this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'Deleted an campaignTemplate' });
                this.activeModal.dismiss(true);
            },
            (res: ResponseWrapper) => this.onError(res)
        );
        // this.activeModal.dismiss(true);
    }
    // private subscribeToSaveResponse(result: Observable<CampaignTemplate>) {
    //     result.subscribe((res: CampaignTemplate) =>
    //         this.onPushNotificationDeleteSuccess(res), (res: Response) => this.onError(res));
    // }

    private onPushNotificationDeleteSuccess(result: any) {
        this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
        this.activeModal.dismiss(result);
    }

    // private onPushNotificationDeleteSuccess(response, headers) {
    //     if (response.result) {
    //         this.alertService.success(response.message);
    //     } else {
    //         this.alertService.error(response.message);
    //     }
    // }

}

@Component({
    selector: 'jhi-campaign-template-delete-popup',
    template: ''
})
export class CampaignTemplateDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignTemplatePopupService
                .open(CampaignTemplateDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
