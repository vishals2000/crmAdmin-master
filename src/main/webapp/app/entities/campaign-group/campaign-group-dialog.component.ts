import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignGroup } from './campaign-group.model';
import { CampaignGroupPopupService } from './campaign-group-popup.service';
import { CampaignGroupService } from './campaign-group.service';

@Component({
    selector: 'jhi-campaign-group-dialog',
    templateUrl: './campaign-group-dialog.component.html'
})
export class CampaignGroupDialogComponent implements OnInit {

    campaignGroup: CampaignGroup;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignGroupService: CampaignGroupService,
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
        if (this.campaignGroup.id !== undefined) {
            this.subscribeToSaveResponse(
                this.campaignGroupService.update(this.campaignGroup));
        } else {
            this.subscribeToSaveResponse(
                this.campaignGroupService.create(this.campaignGroup));
        }
    }

    private subscribeToSaveResponse(result: Observable<CampaignGroup>) {
        result.subscribe((res: CampaignGroup) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CampaignGroup) {
        this.eventManager.broadcast({ name: 'campaignGroupListModification', content: 'OK'});
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
    selector: 'jhi-campaign-group-popup',
    template: ''
})
export class CampaignGroupPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignGroupPopupService: CampaignGroupPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.campaignGroupPopupService
                    .open(CampaignGroupDialogComponent as Component, params['id']);
            } else {
                this.campaignGroupPopupService
                    .open(CampaignGroupDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
