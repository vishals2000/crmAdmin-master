import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { FilterCriteria } from './filter-criteria.model';
import { FilterCriteriaService } from './filter-criteria.service';

@Component({
    selector: 'jhi-filter-criteria-detail',
    templateUrl: './filter-criteria-detail.component.html'
})
export class FilterCriteriaDetailComponent implements OnInit, OnDestroy {

    filterCriteria: FilterCriteria;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private filterCriteriaService: FilterCriteriaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFilterCriteria();
    }

    load(id) {
        this.filterCriteriaService.find(id).subscribe((filterCriteria) => {
            this.filterCriteria = filterCriteria;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFilterCriteria() {
        this.eventSubscriber = this.eventManager.subscribe(
            'filterCriteriaListModification',
            (response) => this.load(this.filterCriteria.id)
        );
    }
}
