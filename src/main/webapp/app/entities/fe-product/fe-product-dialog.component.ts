import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FeProduct } from './fe-product.model';
import { FeProductPopupService } from './fe-product-popup.service';
import { FeProductService } from './fe-product.service';

@Component({
    selector: 'jhi-fe-product-dialog',
    templateUrl: './fe-product-dialog.component.html'
})
export class FeProductDialogComponent implements OnInit {

    feProduct: FeProduct;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private feProductService: FeProductService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.feProduct.id !== undefined) {
            this.subscribeToSaveResponse(
                this.feProductService.update(this.feProduct));
        } else {
            this.subscribeToSaveResponse(
                this.feProductService.create(this.feProduct));
        }
    }

    private subscribeToSaveResponse(result: Observable<FeProduct>) {
        result.subscribe((res: FeProduct) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: FeProduct) {
        this.eventManager.broadcast({ name: 'feProductListModification', content: 'OK'});
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
    selector: 'jhi-fe-product-popup',
    template: ''
})
export class FeProductPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private feProductPopupService: FeProductPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.feProductPopupService
                    .open(FeProductDialogComponent as Component, params['id']);
            } else {
                this.feProductPopupService
                    .open(FeProductDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
