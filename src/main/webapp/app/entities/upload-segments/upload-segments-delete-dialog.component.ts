import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { UploadSegments } from './upload-segments.model';
import { UploadSegmentsPopupService } from './upload-segments-popup.service';
import { UploadSegmentsService } from './upload-segments.service';

@Component({
    selector: 'jhi-upload-segments-delete-dialog',
    templateUrl: './upload-segments-delete-dialog.component.html'
})
export class UploadSegmentsDeleteDialogComponent {

    uploadSegments: UploadSegments;

    constructor(
        private uploadSegmentsService: UploadSegmentsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.uploadSegmentsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'uploadSegmentsListModification',
                content: 'Deleted an uploadSegments'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-upload-segments-delete-popup',
    template: ''
})
export class UploadSegmentsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private uploadSegmentsPopupService: UploadSegmentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.uploadSegmentsPopupService
                .open(UploadSegmentsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
