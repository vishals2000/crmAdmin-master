import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { EventCriteria } from './event-criteria.model';
import { EventCriteriaPopupService } from './event-criteria-popup.service';
import { EventCriteriaService } from './event-criteria.service';

@Component({
    selector: 'jhi-event-criteria-delete-dialog',
    templateUrl: './event-criteria-delete-dialog.component.html'
})
export class EventCriteriaDeleteDialogComponent {

    eventCriteria: EventCriteria;

    constructor(
        private eventCriteriaService: EventCriteriaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.eventCriteriaService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'eventCriteriaListModification',
                content: 'Deleted an eventCriteria'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-criteria-delete-popup',
    template: ''
})
export class EventCriteriaDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventCriteriaPopupService: EventCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.eventCriteriaPopupService
                .open(EventCriteriaDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
