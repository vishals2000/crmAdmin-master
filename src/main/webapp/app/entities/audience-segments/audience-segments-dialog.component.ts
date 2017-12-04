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
    formData: FormData;
    uploadOpt : string;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private audienceSegmentsService: AudienceSegmentsService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.uploadOpt = 'APPEND';
        this.formData = new FormData();
        this.audienceSegmentsService.currentAppInfo.subscribe((data) => {
            this.audienceSegments.frontEnd = data[0];
            this.audienceSegments.product = data[1];
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        if (this.audienceSegments.id !== undefined) {
            if (this.formData.get('file') != null) {
                this.isSaving = true;
                this.subscribeToSaveResponse(
                    this.audienceSegmentsService.uploadToExisting({id: this.audienceSegments.id, editType: this.uploadOpt}, this.formData));
            }
            /*else{
                this.subscribeToSaveResponse(
                    this.audienceSegmentsService.update(this.audienceSegments));
            }*/
            
        } else {
            this.isSaving = true;
            this.subscribeToSaveResponse(
                this.audienceSegmentsService.create(this.audienceSegments));
        }
    }

    // file upload event
    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            this.formData = new FormData();
            this.formData.append('file', file);
        }
    }

    onSelectionChange(sSelectedType){
        this.uploadOpt = sSelectedType;
    }

    private subscribeToSaveResponse(result: Observable<AudienceSegments>) {
        result.subscribe((res: AudienceSegments) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: AudienceSegments) {
        this.eventManager.broadcast({ name: 'audienceSegmentsListModification', content: 'OK' });
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
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
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
