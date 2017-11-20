import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseWrapper } from '../../shared';

import {
    CampaignTemplateFilterCriterion, RecurrenceType, FilterOption, CampaignTargetGroupSizeRequest,
    TargetGroupFilterCriterionSizeRequest
} from './campaign-template.model';

@Component({
    selector: 'jhi-campaign-template-launch-dialog',
    templateUrl: './campaign-template-launch-dialog.component.html'
})
export class CampaignTemplateLaunchDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    targetGroupSize: Number;

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
        // console.log(this.campaignTemplate.targetGroupFilterCriteria);
        this.getTargetGroupSize();
    }

    getTargetGroupSize() {
        // const targetGroupFilters = this.campaignTemplate.targetGroupFilterCriteria as FormArray;
        // let formLengthIterator = 0;
        // const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        // while (formLengthIterator < targetGroupFilters.length) {
        //     const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
        //     const optionValues: string[] = [];
        //     if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
        //         for (const optionValue of targetGroupFilter.get('filterOptionValue').value) {
        //             optionValues.push(optionValue);
        //         }
        //     } else {
        //         optionValues.push(targetGroupFilter.get('filterOptionValue').value);
        //     }
        //     targetGroupFilterCriteria.push(new TargetGroupFilterCriterionSizeRequest(targetGroupFilter.get('filterOption').value,
        //         targetGroupFilter.get('filterOptionLookUp').value,
        //         targetGroupFilter.get('filterOptionComparison').value,
        //         optionValues));
        //     formLengthIterator = formLengthIterator + 1;
        // }

        const body = new CampaignTargetGroupSizeRequest(
            this.campaignTemplate.frontEnd,
            this.campaignTemplate.product,
            this.campaignTemplate.targetGroupFilterCriteria);

        this.campaignTemplateService.getTargetGroupSize(body).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupSizeRequestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private onTargetGroupSizeRequestSuccess(data, headers) {
        console.log(data);
        if (data) {
            this.targetGroupSize = data.targetGroupSize;
            alert(this.targetGroupSize);
        } else {
            this.targetGroupSize = 0;
        }
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

        this.campaignTemplateService.pushNotificationCampaign(data).subscribe(
            (res: ResponseWrapper) => this.onPushNotificationLaunchSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.activeModal.dismiss(true);
    }

    private onPushNotificationLaunchSuccess(response, headers) {
        if (response.result) {
            this.alertService.success(response.message);
        } else {
            this.alertService.error(response.message);
        }

        this.campaignTemplateService.updateLaunchStatus(
            {
                campaignTemplateId: this.campaignTemplate.id,
                status: response.result,
                method: 'updateLaunchStatus'
            }
        ).subscribe(
            (res: ResponseWrapper) => {
                this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
            },
            (res: ResponseWrapper) => this.onError(res.json)
            );

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
