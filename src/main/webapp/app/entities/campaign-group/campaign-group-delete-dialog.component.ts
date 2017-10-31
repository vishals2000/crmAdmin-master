import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CampaignGroup } from './campaign-group.model';
import { CampaignGroupPopupService } from './campaign-group-popup.service';
import { CampaignGroupService } from './campaign-group.service';

@Component({
    selector: 'jhi-campaign-group-delete-dialog',
    templateUrl: './campaign-group-delete-dialog.component.html'
})
export class CampaignGroupDeleteDialogComponent {

    campaignGroup: CampaignGroup;

    constructor(
        private campaignGroupService: CampaignGroupService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.campaignGroupService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'campaignGroupListModification',
                content: 'Deleted an campaignGroup'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-campaign-group-delete-popup',
    template: ''
})
export class CampaignGroupDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignGroupPopupService: CampaignGroupPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignGroupPopupService
                .open(CampaignGroupDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
