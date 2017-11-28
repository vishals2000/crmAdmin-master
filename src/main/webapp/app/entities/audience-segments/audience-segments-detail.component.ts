import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { AudienceSegments } from './audience-segments.model';
import { AudienceSegmentsService } from './audience-segments.service';

@Component({
    selector: 'jhi-audience-segments-detail',
    templateUrl: './audience-segments-detail.component.html'
})
export class AudienceSegmentsDetailComponent implements OnInit, OnDestroy {

    audienceSegments: AudienceSegments;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private audienceSegmentsService: AudienceSegmentsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAudienceSegments();
    }

    load(id) {
        this.audienceSegmentsService.find(id).subscribe((audienceSegments) => {
            this.audienceSegments = audienceSegments;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAudienceSegments() {
        this.eventSubscriber = this.eventManager.subscribe(
            'audienceSegmentsListModification',
            (response) => this.load(this.audienceSegments.id)
        );
    }
}
