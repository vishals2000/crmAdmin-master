import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FilterCriteria } from './filter-criteria.model';
import { FilterCriteriaPopupService } from './filter-criteria-popup.service';
import { FilterCriteriaService } from './filter-criteria.service';

import { ResponseWrapper } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';

@Component({
    selector: 'jhi-filter-criteria-dialog',
    templateUrl: './filter-criteria-dialog.component.html'
})
export class FilterCriteriaDialogComponent implements OnInit {

    filterCriteria: FilterCriteria;
    isSaving: boolean;
    predicate: any;
    reverse: any;
    feProducts: FeProduct[];
    frontEnds: string[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private filterCriteriaService: FilterCriteriaService,
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
        if (this.filterCriteria.id !== undefined) {
            this.subscribeToSaveResponse(
                this.filterCriteriaService.update(this.filterCriteria));
        } else {
            this.subscribeToSaveResponse(
                this.filterCriteriaService.create(this.filterCriteria));
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

    private subscribeToSaveResponse(result: Observable<FilterCriteria>) {
        result.subscribe((res: FilterCriteria) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: FilterCriteria) {
        this.eventManager.broadcast({ name: 'filterCriteriaListModification', content: 'OK'});
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
    selector: 'jhi-filter-criteria-popup',
    template: ''
})
export class FilterCriteriaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private filterCriteriaPopupService: FilterCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.filterCriteriaPopupService
                    .open(FilterCriteriaDialogComponent as Component, params['id']);
            } else {
                this.filterCriteriaPopupService
                    .open(FilterCriteriaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
