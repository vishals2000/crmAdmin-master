import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AudienceSegments } from './audience-segments.model';
import { AudienceSegmentsPopupService } from './audience-segments-popup.service';
import { AudienceSegmentsService } from './audience-segments.service';

@Component({
    selector: 'jhi-audience-segments-dialog',
    templateUrl: './audience-segments-dialog.component.html'
})
export class AudienceSegmentsDialogComponent implements OnInit {

    audienceSegments: AudienceSegments;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private audienceSegmentsService: AudienceSegmentsService,
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
        if (this.audienceSegments.id !== undefined) {
            this.subscribeToSaveResponse(
                this.audienceSegmentsService.update(this.audienceSegments));
        } else {
            this.subscribeToSaveResponse(
                this.audienceSegmentsService.create(this.audienceSegments));
        }
    }

    private subscribeToSaveResponse(result: Observable<AudienceSegments>) {
        result.subscribe((res: AudienceSegments) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: AudienceSegments) {
        this.eventManager.broadcast({ name: 'audienceSegmentsListModification', content: 'OK'});
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
    selector: 'jhi-audience-segments-popup',
    template: ''
})
export class AudienceSegmentsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private audienceSegmentsPopupService: AudienceSegmentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.audienceSegmentsPopupService
                    .open(AudienceSegmentsDialogComponent as Component, params['id']);
            } else {
                this.audienceSegmentsPopupService
                    .open(AudienceSegmentsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
