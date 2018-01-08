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
import { Subscription } from 'rxjs/Rx';
import { CampaignTemplateDialogComponent } from './campaign-template-dialog.component';

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
    targetGroupSize: any;
    dialogParamters: any;
    targetContentGroupSize: any[];
    segmentNames: any[];
    eventSubscriber: Subscription;
    isRetarget : boolean;
    isFromLaunch: boolean;

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private http: HttpClient,
        private alertService: JhiAlertService,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {
        this.isRetarget = false;
        this.targetGroupSize = "Loading...";
        this.isFromLaunch = false;
    }

    ngOnInit() {
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
            this.segmentNames = [];
            this.getSegments();
            this.targetContentGroupSize = [];
        });       
        this.isRetarget = this.dialogParamters && this.dialogParamters.isRetarget ? true : false;
        this.isFromLaunch = this.dialogParamters && this.dialogParamters.isFromLaunch ? true : false;
    }
    getSegments(){
        const body = {
            'frontEnd': this.campaignTemplate.frontEnd,
            'product': this.campaignTemplate.product
        }
        this.campaignTemplateService.getSegments(body).subscribe(
            (res: ResponseWrapper) => {
                this.segmentNames = res['segments'];
                this.getTargetGroupSize();
                this.getTargetContentGroupSize();
            },
            (res: ResponseWrapper) => {
                this.getTargetGroupSize();
                this.getTargetContentGroupSize();
            }
        );
    }

    getTargetGroupSize() {
        const languagesUpdated: string[] = [];
        for (var i =0;i<this.campaignTemplate.targetGroupContentCriteria.length;i++) {
            languagesUpdated.push(this.campaignTemplate.targetGroupContentCriteria[i].languageSelected);
            this.targetContentGroupSize[i] = "Loading...";
        }
        const body = new CampaignTargetGroupSizeRequest(
            this.campaignTemplate.frontEnd,
            this.campaignTemplate.product,
            languagesUpdated,
            this.campaignTemplate.targetGroupFilterCriteria, this.campaignTemplate.retargetedCampaign || false, this.campaignTemplate.parentCampaignTemplateId || '');

        this.campaignTemplateService.getTargetGroupSize(body).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupSizeRequestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    getFiltersWithDesc(oFilObj){
        if(oFilObj.filterOption === 'Segment'){
            for(var i=0;this.segmentNames && i<this.segmentNames.length;i++){
                if(this.segmentNames[i].id === oFilObj.filterOptionValue[0]){
                    return oFilObj.filterOption + " "+ oFilObj.filterOptionComparison + " " + oFilObj.filterOptionLookUp + " " +this.segmentNames[i].name;
                }
            }
        }
        return oFilObj.filterOption + " "+ oFilObj.filterOptionComparison + " " + oFilObj.filterOptionLookUp + " " + oFilObj.filterOptionValue;   
    }
    getDateMonthDate(month){
        return month <= 9 ? '0' + month : month;
    }
    getTargetContentGroupSize() {
        for (let i =0;i<this.campaignTemplate.targetGroupContentCriteria.length;i++) {
            const body = {
                'frontEnd': this.campaignTemplate.frontEnd,
                'product': this.campaignTemplate.product,
                'language': this.campaignTemplate.targetGroupContentCriteria[i].languageSelected,
                'targetGroupFilterCriteria': this.campaignTemplate.targetGroupFilterCriteria,
                'retargetedCampaign': this.campaignTemplate.retargetedCampaign || false,
                'parentCampaignTemplateId': this.campaignTemplate.parentCampaignTemplateId || ''
            }
          
            this.campaignTemplateService.getTargetContentGroupSize(body).subscribe(
                (res: ResponseWrapper) => this.onTargetGroupContentSizeRequestSuccess(res, res, i),
                (res: ResponseWrapper) => this.onTargetGroupContentSizeRequestSuccess(res, res, i),
            );
        }
        
    }
    goToParent(){
        this.activeModal.dismiss('cancel');
        this.eventManager.broadcast({ name: 'closeCampaignTemp', content: 'OK' });
        this.campaignTemplatePopupService.openWithoutRouter(CampaignTemplateDialogComponent as Component, {}, false, this.campaignTemplate.id);
    }

    private onTargetGroupContentSizeRequestSuccess(data, headers, contentGrpNo) {
        if (data) {
            this.targetContentGroupSize[contentGrpNo] = data.targetGroupSize;
        } else {
            this.targetContentGroupSize[contentGrpNo] = 0;
        }
    }

    private onTargetGroupSizeRequestSuccess(data, headers) {
        console.log(data);
        if (data) {
            this.targetGroupSize = data.targetGroupSize;
        } else {
            this.targetGroupSize = 0;
        }
    }
    close(){
        this.activeModal.dismiss('cancel');
        if(this.isRetarget){
            document.body.classList.add('modal-open');
        }
    }
    clear() {
        this.activeModal.dismiss('cancel');
        if(this.isRetarget){
            document.body.classList.add('modal-open');
        }
        if(this.isFromLaunch){
            this.campaignTemplatePopupService.openWithoutRouter(CampaignTemplateDialogComponent as Component, {}, false, this.campaignTemplate.id);
        }
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
        this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
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
                .openWithoutRouter(CampaignTemplateLaunchDialogComponent as Component, {isFromLaunch: params['fromLaunch']}, true,  params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
