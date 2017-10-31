import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Apps } from './apps.model';
import { AppsPopupService } from './apps-popup.service';
import { AppsService } from './apps.service';

@Component({
    selector: 'jhi-apps-delete-dialog',
    templateUrl: './apps-delete-dialog.component.html'
})
export class AppsDeleteDialogComponent {

    apps: Apps;

    constructor(
        private appsService: AppsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.appsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'appsListModification',
                content: 'Deleted an apps'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-apps-delete-popup',
    template: ''
})
export class AppsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private appsPopupService: AppsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.appsPopupService
                .open(AppsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
