import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { FeProduct } from './fe-product.model';
import { FeProductService } from './fe-product.service';

@Component({
    selector: 'jhi-fe-product-detail',
    templateUrl: './fe-product-detail.component.html'
})
export class FeProductDetailComponent implements OnInit, OnDestroy {

    feProduct: FeProduct;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private feProductService: FeProductService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFeProducts();
    }

    load(id) {
        this.feProductService.find(id).subscribe((feProduct) => {
            this.feProduct = feProduct;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFeProducts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'feProductListModification',
            (response) => this.load(this.feProduct.id)
        );
    }
}
