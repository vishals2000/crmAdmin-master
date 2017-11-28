import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { UploadSegments } from './upload-segments.model';
import { UploadSegmentsPopupService } from './upload-segments-popup.service';
import { UploadSegmentsService } from './upload-segments.service';

@Component({
    selector: 'jhi-upload-segments-dialog',
    templateUrl: './upload-segments-dialog.component.html'
})
export class UploadSegmentsDialogComponent implements OnInit {

    uploadSegments: UploadSegments;
    isSaving: boolean;
    private isUploadBtn: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private uploadSegmentsService: UploadSegmentsService,
        private eventManager: JhiEventManager,
        private http: Http
    ) {
    }

    // file upload event
    fileChange(event) {
        // debugger;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers()
            // headers.append('Content-Type', 'json');
            // headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            let apiUrl1 = "/api/UploadFileApi";
            this.http.post(apiUrl1, formData, options)
                .map((res) => res.json())
                .catch((error) => Observable.throw(error))
                .subscribe(
                (data) => console.log('success'),
                (error) => console.log(error)
                )
        }
        window.location.reload();
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.uploadSegments.id !== undefined) {
            this.subscribeToSaveResponse(
                this.uploadSegmentsService.update(this.uploadSegments));
        } else {
            this.subscribeToSaveResponse(
                this.uploadSegmentsService.create(this.uploadSegments));
        }
    }

    private subscribeToSaveResponse(result: Observable<UploadSegments>) {
        result.subscribe((res: UploadSegments) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: UploadSegments) {
        this.eventManager.broadcast({ name: 'uploadSegmentsListModification', content: 'OK'});
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
    selector: 'jhi-upload-segments-popup',
    template: ''
})
export class UploadSegmentsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private uploadSegmentsPopupService: UploadSegmentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.uploadSegmentsPopupService
                    .open(UploadSegmentsDialogComponent as Component, params['id']);
            } else {
                this.uploadSegmentsPopupService
                    .open(UploadSegmentsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
