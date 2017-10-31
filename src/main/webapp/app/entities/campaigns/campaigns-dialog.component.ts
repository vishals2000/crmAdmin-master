import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Campaigns } from './campaigns.model';
import { CampaignsPopupService } from './campaigns-popup.service';
import { CampaignsService } from './campaigns.service';

@Component({
    selector: 'jhi-campaigns-dialog',
    templateUrl: './campaigns-dialog.component.html'
})
export class CampaignsDialogComponent implements OnInit {

    campaigns: Campaigns;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignsService: CampaignsService,
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
        if (this.campaigns.id !== undefined) {
            this.subscribeToSaveResponse(
                this.campaignsService.update(this.campaigns));
        } else {
            this.subscribeToSaveResponse(
                this.campaignsService.create(this.campaigns));
        }
    }

    private subscribeToSaveResponse(result: Observable<Campaigns>) {
        result.subscribe((res: Campaigns) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Campaigns) {
        this.eventManager.broadcast({ name: 'campaignsListModification', content: 'OK'});
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
    selector: 'jhi-campaigns-popup',
    template: ''
})
export class CampaignsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignsPopupService: CampaignsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.campaignsPopupService
                    .open(CampaignsDialogComponent as Component, params['id']);
            } else {
                this.campaignsPopupService
                    .open(CampaignsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
