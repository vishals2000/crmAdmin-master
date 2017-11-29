import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { HttpClientModule, HttpClient, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AudienceSegments } from './audience-segments.model';
import { AudienceSegmentsPopupService } from './audience-segments-popup.service';
import { AudienceSegmentsService } from './audience-segments.service';

@Component({
    selector: 'jhi-upload-segments-dialog',
    templateUrl: './upload-segments-dialog.component.html'
})
export class UploadSegmentsDialogComponent implements OnInit {

    audienceSegments: AudienceSegments;
    isSaving: boolean;
    formData: FormData;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private audienceSegmentsService: AudienceSegmentsService,
        private eventManager: JhiEventManager,
        private http: Http
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
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
        this.isSaving = true;
        if (this.audienceSegments.id !== undefined) {
            this.subscribeToSaveResponse(
                this.audienceSegmentsService.update(this.audienceSegments));
        } else {
            this.subscribeToSaveResponse(
                this.audienceSegmentsService.create(this.audienceSegments, this.formData));
        }
    }

    // file upload event
    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];                      

            // let formData: FormData = new FormData();
            this.formData  = new FormData();
            this.formData.append('file', file);
            
            // for (var j = 0; j < fileList.length; j++) {
            //     formData.append("file[]", fileList[j], fileList[j].name);
            // }
            // var parameters = {
            //     'front_end': this.audienceSegments.frontEnd,
            //     'product': this.audienceSegments.product,
            //     'name' : this.audienceSegments.name
            // }

            // let headers = new Headers();
            // // headers.append('Content-Type', undefined);
            // this.options = new RequestOptions({
            //     headers: headers,
            //     params : parameters
            //  });
            
            // this.http.post('api/audience-segments/upload-segment', this.formData, this.options)
            //          .map(response => response.json())
            //          .catch(error => Observable.throw(error)).subscribe(
            //                 (data) => console.log('success'),
            //                 (error) => console.log(error)
            //                 );            
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
    selector: 'jhi-upload-segments-popup',
    template: ''
})
export class UploadSegmentsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private audienceSegmentsPopupService: AudienceSegmentsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.audienceSegmentsPopupService
                    .open(UploadSegmentsDialogComponent as Component, params['id']);
            } else {
                this.audienceSegmentsPopupService
                    .open(UploadSegmentsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
