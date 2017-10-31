import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { TargetGroupCriteria } from './target-group-criteria.model';
import { TargetGroupCriteriaPopupService } from './target-group-criteria-popup.service';
import { TargetGroupCriteriaService } from './target-group-criteria.service';

@Component({
    selector: 'jhi-target-group-criteria-delete-dialog',
    templateUrl: './target-group-criteria-delete-dialog.component.html'
})
export class TargetGroupCriteriaDeleteDialogComponent {

    targetGroupCriteria: TargetGroupCriteria;

    constructor(
        private targetGroupCriteriaService: TargetGroupCriteriaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.targetGroupCriteriaService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'targetGroupCriteriaListModification',
                content: 'Deleted an targetGroupCriteria'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-target-group-criteria-delete-popup',
    template: ''
})
export class TargetGroupCriteriaDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private targetGroupCriteriaPopupService: TargetGroupCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.targetGroupCriteriaPopupService
                .open(TargetGroupCriteriaDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
