import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

// import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';

import { ResponseWrapper } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';
import { MessageContentService } from '../message-content/message-content.service';
import { TargetGroupCriteriaService } from '../target-group-criteria/target-group-criteria.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-campaign-template-dialog',
    templateUrl: './campaign-template-dialog.component.html'
})
export class CampaignTemplateDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    isSaving: boolean;
    startDateDp: any;
    recurrenceEndDateDp: any;
    predicate: any;
    reverse: any;
    feProducts: FeProduct[];
    frontEnds: string[];
    messageContentIds: string[];
    targetGroupIds: string[];
    errorMessage: any;
    minDate: NgbDateStruct;
    time: SimpleTime;
    search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => term.length < 2 ? []
        : this.messageContentIds.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
    searchTargetGroup = (text$: Observable<string>) =>
        text$
          .debounceTime(200)
          .distinctUntilChanged()
          .map((term) => term.length < 1 ? []
            : this.targetGroupIds.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignTemplateService: CampaignTemplateService,
        private eventManager: JhiEventManager,
        private feProductService: FeProductService,
        private messageContentService: MessageContentService,
        private targetGroupCriteriaService: TargetGroupCriteriaService
    ) {
        this.feProducts = [];
        this.frontEnds = [];
        this.messageContentIds = [];
        this.targetGroupIds = [];
    }

    ngOnInit() {
        this.isSaving = false;
        if (this.campaignTemplate && this.campaignTemplate.scheduledTime && this.campaignTemplate.scheduledTime.substr(0, 2) && this.campaignTemplate.scheduledTime.substr(3, 2)) {
            this.time = new SimpleTime(Number(this.campaignTemplate.scheduledTime.substr(0, 2)), Number(this.campaignTemplate.scheduledTime.substr(3, 2)));
        } else {
            this.time = new SimpleTime(11, 0);
        }
        this.populateFrontEnds();
        if (this.campaignTemplate.frontEnd && this.campaignTemplate.product) {
            this.populateMessageContents(this.campaignTemplate.frontEnd, this.campaignTemplate.product);
            this.populateTargetGroups(this.campaignTemplate.frontEnd, this.campaignTemplate.product);
        }
        const now = new Date();
        this.minDate = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
          };
    }

    populateMessageContents(frontEndId, productId) {
        this.messageContentIds = [];
        this.messageContentService.queryMessageContent({
            frontEnd: frontEndId,
            product: productId,
            page: 0,
            size: 10000,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onMessageContentIdsSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.populateTargetGroups(frontEndId, productId);
    }

    populateTargetGroups(frontEndId, productId) {
        this.targetGroupIds = [];
        this.targetGroupCriteriaService.queryTargetGroup({
            frontEnd: frontEndId,
            product: productId,
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupIdsSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    populateFeProducts(id) {
        this.feProducts = [];
        this.messageContentIds = [];
        this.targetGroupIds = [];
        this.feProductService.queryProductsForFrontEnd({
            frontEnd: id,
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onFeProductSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    populateFrontEnds() {
        this.frontEnds = [];
        this.feProductService.queryDistinctFe({
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onFeFrontEndSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.campaignTemplate.scheduledTime = '' + (this.time.hour < 10 ? '0' + this.time.hour : this.time.hour) + ':' +
        (this.time.minute < 10 ? '0' + this.time.minute : this.time.minute);
        if (this.campaignTemplate.id !== undefined) {
            this.subscribeToSaveResponse(
                this.campaignTemplateService.update(this.campaignTemplate));
        } else {
            this.subscribeToSaveResponse(
                this.campaignTemplateService.create(this.campaignTemplate));
        }
    }

    private subscribeToSaveResponse(result: Observable<CampaignTemplate>) {
        result.subscribe((res: CampaignTemplate) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CampaignTemplate) {
        this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.errorMessage = error;
        this.alertService.error(error, null, null);
    }

    private onMessageContentIdsSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.messageContentIds.push(data[i]);
        }
    }

    private onTargetGroupIdsSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.targetGroupIds.push(data[i]);
        }
    }

    private onFeProductSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.feProducts.push(data[i]);
        }
    }

    private onFeFrontEndSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.frontEnds.push(data[i]);
        }
    }
}

@Component({
    selector: 'jhi-campaign-template-popup',
    template: ''
})
export class CampaignTemplatePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.campaignTemplatePopupService
                    .open(CampaignTemplateDialogComponent as Component, params['id']);
            } else {
                this.campaignTemplatePopupService
                    .open(CampaignTemplateDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

@Component({
    selector: 'jhi-ngbd-timepicker-basic',
    template: `
    <ngb-timepicker [(ngModel)]="time"></ngb-timepicker>
    `
  })
export class NgbdTimepickerBasicComponent {
    time = {hour: 13, minute: 30};
}

export class SimpleTime {
    constructor(
        public hour?: number,
        public minute?: number,
    ) {
    }
}
