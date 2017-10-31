import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { FeProduct } from './fe-product.model';
import { FeProductPopupService } from './fe-product-popup.service';
import { FeProductService } from './fe-product.service';

@Component({
    selector: 'jhi-fe-product-delete-dialog',
    templateUrl: './fe-product-delete-dialog.component.html'
})
export class FeProductDeleteDialogComponent {

    feProduct: FeProduct;

    constructor(
        private feProductService: FeProductService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.feProductService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'feProductListModification',
                content: 'Deleted an feProduct'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-fe-product-delete-popup',
    template: ''
})
export class FeProductDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private feProductPopupService: FeProductPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.feProductPopupService
                .open(FeProductDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
