import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Apps } from './apps.model';
import { AppsPopupService } from './apps-popup.service';
import { AppsService } from './apps.service';

@Component({
    selector: 'jhi-apps-dialog',
    templateUrl: './apps-dialog.component.html'
})
export class AppsDialogComponent implements OnInit {

    apps: Apps;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private appsService: AppsService,
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
        if (this.apps.id !== undefined) {
            this.subscribeToSaveResponse(
                this.appsService.update(this.apps));
        } else {
            this.subscribeToSaveResponse(
                this.appsService.create(this.apps));
        }
    }

    private subscribeToSaveResponse(result: Observable<Apps>) {
        result.subscribe((res: Apps) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Apps) {
        this.eventManager.broadcast({ name: 'appsListModification', content: 'OK'});
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
    selector: 'jhi-apps-popup',
    template: ''
})
export class AppsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private appsPopupService: AppsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.appsPopupService
                    .open(AppsDialogComponent as Component, params['id']);
            } else {
                this.appsPopupService
                    .open(AppsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
