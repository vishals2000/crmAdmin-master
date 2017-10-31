import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TagCriteria } from './tag-criteria.model';
import { TagCriteriaPopupService } from './tag-criteria-popup.service';
import { TagCriteriaService } from './tag-criteria.service';

import { ResponseWrapper } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';

@Component({
    selector: 'jhi-tag-criteria-dialog',
    templateUrl: './tag-criteria-dialog.component.html'
})
export class TagCriteriaDialogComponent implements OnInit {

    tagCriteria: TagCriteria;
    isSaving: boolean;
    predicate: any;
    reverse: any;
    feProducts: FeProduct[];
    frontEnds: string[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private tagCriteriaService: TagCriteriaService,
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
        if (this.tagCriteria.id !== undefined) {
            this.subscribeToSaveResponse(
                this.tagCriteriaService.update(this.tagCriteria));
        } else {
            this.subscribeToSaveResponse(
                this.tagCriteriaService.create(this.tagCriteria));
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

    private subscribeToSaveResponse(result: Observable<TagCriteria>) {
        result.subscribe((res: TagCriteria) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: TagCriteria) {
        this.eventManager.broadcast({ name: 'tagCriteriaListModification', content: 'OK'});
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
    selector: 'jhi-tag-criteria-popup',
    template: ''
})
export class TagCriteriaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tagCriteriaPopupService: TagCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.tagCriteriaPopupService
                    .open(TagCriteriaDialogComponent as Component, params['id']);
            } else {
                this.tagCriteriaPopupService
                    .open(TagCriteriaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
