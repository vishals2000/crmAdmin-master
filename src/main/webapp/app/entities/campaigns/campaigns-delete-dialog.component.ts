import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Campaigns } from './campaigns.model';
import { CampaignsPopupService } from './campaigns-popup.service';
import { CampaignsService } from './campaigns.service';

@Component({
    selector: 'jhi-campaigns-delete-dialog',
    templateUrl: './campaigns-delete-dialog.component.html'
})
export class CampaignsDeleteDialogComponent {

    campaigns: Campaigns;

    constructor(
        private campaignsService: CampaignsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.campaignsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'campaignsListModification',
                content: 'Deleted an campaigns'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-campaigns-delete-popup',
    template: ''
})
export class CampaignsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignsPopupService: CampaignsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignsPopupService
                .open(CampaignsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
