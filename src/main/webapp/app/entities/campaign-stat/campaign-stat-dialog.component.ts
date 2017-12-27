import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CampaignStat } from './campaign-stat.model';
import { CampaignStatPopupService } from './campaign-stat-popup.service';
import { CampaignStatService } from './campaign-stat.service';

@Component({
    selector: 'jhi-campaign-stat-dialog',
    templateUrl: './campaign-stat-dialog.component.html'
})
export class CampaignStatDialogComponent implements OnInit {

    campaignStat: CampaignStat;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignStatService: CampaignStatService,
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
        if (this.campaignStat.id !== undefined) {
            this.subscribeToSaveResponse(
                this.campaignStatService.update(this.campaignStat));
        } else {
            this.subscribeToSaveResponse(
                this.campaignStatService.create(this.campaignStat));
        }
    }

    private subscribeToSaveResponse(result: Observable<CampaignStat>) {
        result.subscribe((res: CampaignStat) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CampaignStat) {
        this.eventManager.broadcast({ name: 'campaignStatListModification', content: 'OK'});
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
    selector: 'jhi-campaign-stat-popup',
    template: ''
})
export class CampaignStatPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignStatPopupService: CampaignStatPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.campaignStatPopupService
                    .open(CampaignStatDialogComponent as Component, params['id']);
            } else {
                this.campaignStatPopupService
                    .open(CampaignStatDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
