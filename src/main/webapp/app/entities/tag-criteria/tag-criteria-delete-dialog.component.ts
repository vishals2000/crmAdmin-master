import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { TagCriteria } from './tag-criteria.model';
import { TagCriteriaPopupService } from './tag-criteria-popup.service';
import { TagCriteriaService } from './tag-criteria.service';

@Component({
    selector: 'jhi-tag-criteria-delete-dialog',
    templateUrl: './tag-criteria-delete-dialog.component.html'
})
export class TagCriteriaDeleteDialogComponent {

    tagCriteria: TagCriteria;

    constructor(
        private tagCriteriaService: TagCriteriaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.tagCriteriaService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'tagCriteriaListModification',
                content: 'Deleted an tagCriteria'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-tag-criteria-delete-popup',
    template: ''
})
export class TagCriteriaDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private tagCriteriaPopupService: TagCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.tagCriteriaPopupService
                .open(TagCriteriaDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
