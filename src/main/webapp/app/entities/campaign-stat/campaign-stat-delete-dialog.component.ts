import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CampaignStat } from './campaign-stat.model';
import { CampaignStatPopupService } from './campaign-stat-popup.service';
import { CampaignStatService } from './campaign-stat.service';

@Component({
    selector: 'jhi-campaign-stat-delete-dialog',
    templateUrl: './campaign-stat-delete-dialog.component.html'
})
export class CampaignStatDeleteDialogComponent {

    campaignStat: CampaignStat;

    constructor(
        private campaignStatService: CampaignStatService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.campaignStatService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'campaignStatListModification',
                content: 'Deleted an campaignStat'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-campaign-stat-delete-popup',
    template: ''
})
export class CampaignStatDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignStatPopupService: CampaignStatPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignStatPopupService
                .open(CampaignStatDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
