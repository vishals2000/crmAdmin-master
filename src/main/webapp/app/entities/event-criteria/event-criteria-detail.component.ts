import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { EventCriteria } from './event-criteria.model';
import { EventCriteriaService } from './event-criteria.service';

@Component({
    selector: 'jhi-event-criteria-detail',
    templateUrl: './event-criteria-detail.component.html'
})
export class EventCriteriaDetailComponent implements OnInit, OnDestroy {

    eventCriteria: EventCriteria;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventCriteriaService: EventCriteriaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventCriteria();
    }

    load(id) {
        this.eventCriteriaService.find(id).subscribe((eventCriteria) => {
            this.eventCriteria = eventCriteria;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventCriteria() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventCriteriaListModification',
            (response) => this.load(this.eventCriteria.id)
        );
    }
}
