import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { UploadSegments } from './upload-segments.model';
import { UploadSegmentsService } from './upload-segments.service';

@Component({
    selector: 'jhi-upload-segments-detail',
    templateUrl: './upload-segments-detail.component.html'
})
export class UploadSegmentsDetailComponent implements OnInit, OnDestroy {

    uploadSegments: UploadSegments;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private uploadSegmentsService: UploadSegmentsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInUploadSegments();
    }

    load(id) {
        this.uploadSegmentsService.find(id).subscribe((uploadSegments) => {
            this.uploadSegments = uploadSegments;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInUploadSegments() {
        this.eventSubscriber = this.eventManager.subscribe(
            'uploadSegmentsListModification',
            (response) => this.load(this.uploadSegments.id)
        );
    }
}
