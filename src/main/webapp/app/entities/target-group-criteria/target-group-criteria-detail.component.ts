import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { TargetGroupCriteria } from './target-group-criteria.model';
import { TargetGroupCriteriaService } from './target-group-criteria.service';

@Component({
    selector: 'jhi-target-group-criteria-detail',
    templateUrl: './target-group-criteria-detail.component.html'
})
export class TargetGroupCriteriaDetailComponent implements OnInit, OnDestroy {

    targetGroupCriteria: TargetGroupCriteria;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private targetGroupCriteriaService: TargetGroupCriteriaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTargetGroupCriteria();
    }

    load(id) {
        this.targetGroupCriteriaService.find(id).subscribe((targetGroupCriteria) => {
            this.targetGroupCriteria = targetGroupCriteria;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTargetGroupCriteria() {
        this.eventSubscriber = this.eventManager.subscribe(
            'targetGroupCriteriaListModification',
            (response) => this.load(this.targetGroupCriteria.id)
        );
    }
}
