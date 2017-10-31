import { Component, OnInit, OnDestroy, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MessageContent } from './message-content.model';
import { MessageContentPopupService } from './message-content-popup.service';
import { MessageContentService } from './message-content.service';

import { ResponseWrapper, LANGUAGES } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';

import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-message-content-dialog',
    templateUrl: './message-content-dialog.component.html'
})
export class MessageContentDialogComponent implements OnInit {

    messageContent: MessageContent;
    isSaving: boolean;
    predicate: any;
    reverse: any;
    feProducts: FeProduct[];
    frontEnds: string[];
    languages: string[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private messageContentService: MessageContentService,
        private eventManager: JhiEventManager,
        private feProductService: FeProductService
    ) {
        this.feProducts = [];
        this.frontEnds = [];
        this.languages = LANGUAGES.sort();
    }

    ngOnInit() {
        this.isSaving = false;
        this.populateFrontEnds();

    }

    populateFeProducts(id) {
        this.feProducts = [];
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
        this.feProducts = [];
    }

    save() {
        this.isSaving = true;
        if (this.messageContent.id !== undefined) {
            this.subscribeToSaveResponse(
                this.messageContentService.update(this.messageContent));
        } else {
            this.subscribeToSaveResponse(
                this.messageContentService.create(this.messageContent));
        }
    }
    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
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

    private subscribeToSaveResponse(result: Observable<MessageContent>) {
        result.subscribe((res: MessageContent) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: MessageContent) {
        this.eventManager.broadcast({ name: 'messageContentListModification', content: 'OK'});
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
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-message-content-popup',
    template: ''
})
export class MessageContentPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private messageContentPopupService: MessageContentPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.messageContentPopupService
                    .open(MessageContentDialogComponent as Component, params['id']);
            } else {
                this.messageContentPopupService
                    .open(MessageContentDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
