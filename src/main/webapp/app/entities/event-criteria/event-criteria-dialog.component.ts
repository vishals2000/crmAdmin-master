import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventCriteria } from './event-criteria.model';
import { EventCriteriaPopupService } from './event-criteria-popup.service';
import { EventCriteriaService } from './event-criteria.service';

import { ResponseWrapper } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';

@Component({
    selector: 'jhi-event-criteria-dialog',
    templateUrl: './event-criteria-dialog.component.html'
})
export class EventCriteriaDialogComponent implements OnInit {

    eventCriteria: EventCriteria;
    isSaving: boolean;
    predicate: any;
    reverse: any;
    feProducts: FeProduct[];
    frontEnds: string[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventCriteriaService: EventCriteriaService,
        private eventManager: JhiEventManager,
        private feProductService: FeProductService
    ) {
        this.feProducts = [];
        this.frontEnds = [];
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
    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventCriteria.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventCriteriaService.update(this.eventCriteria));
        } else {
            this.subscribeToSaveResponse(
                this.eventCriteriaService.create(this.eventCriteria));
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

    private subscribeToSaveResponse(result: Observable<EventCriteria>) {
        result.subscribe((res: EventCriteria) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: EventCriteria) {
        this.eventManager.broadcast({ name: 'eventCriteriaListModification', content: 'OK'});
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
    selector: 'jhi-event-criteria-popup',
    template: ''
})
export class EventCriteriaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventCriteriaPopupService: EventCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventCriteriaPopupService
                    .open(EventCriteriaDialogComponent as Component, params['id']);
            } else {
                this.eventCriteriaPopupService
                    .open(EventCriteriaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
