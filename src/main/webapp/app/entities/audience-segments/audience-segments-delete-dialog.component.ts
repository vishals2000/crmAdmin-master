import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AudienceSegments } from './audience-segments.model';
import { AudienceSegmentsPopupService } from './audience-segments-popup.service';
import { AudienceSegmentsService } from './audience-segments.service';

@Component({
    selector: 'jhi-audience-segments-delete-dialog',
    templateUrl: './audience-segments-delete-dialog.component.html'
})
export class AudienceSegmentsDeleteDialogComponent {

    audienceSegments: AudienceSegments;

    constructor(
        private audienceSegmentsService: AudienceSegmentsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.audienceSegmentsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'audienceSegmentsListModification',
                content: 'Deleted an audienceSegments'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-audience-segments-delete-popup',
    template: ''
})
export class AudienceSegmentsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private audienceSegmentsPopupService: AudienceSegmentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.audienceSegmentsPopupService
                .open(AudienceSegmentsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
