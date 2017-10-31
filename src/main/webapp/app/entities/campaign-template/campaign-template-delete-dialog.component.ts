import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';

@Component({
    selector: 'jhi-campaign-template-delete-dialog',
    templateUrl: './campaign-template-delete-dialog.component.html'
})
export class CampaignTemplateDeleteDialogComponent {

    campaignTemplate: CampaignTemplate;

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.campaignTemplateService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'campaignTemplateListModification',
                content: 'Deleted an campaignTemplate'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-campaign-template-delete-popup',
    template: ''
})
export class CampaignTemplateDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.campaignTemplatePopupService
                .open(CampaignTemplateDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
