import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { FilterCriteria } from './filter-criteria.model';
import { FilterCriteriaPopupService } from './filter-criteria-popup.service';
import { FilterCriteriaService } from './filter-criteria.service';

@Component({
    selector: 'jhi-filter-criteria-delete-dialog',
    templateUrl: './filter-criteria-delete-dialog.component.html'
})
export class FilterCriteriaDeleteDialogComponent {

    filterCriteria: FilterCriteria;

    constructor(
        private filterCriteriaService: FilterCriteriaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.filterCriteriaService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'filterCriteriaListModification',
                content: 'Deleted an filterCriteria'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-filter-criteria-delete-popup',
    template: ''
})
export class FilterCriteriaDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private filterCriteriaPopupService: FilterCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.filterCriteriaPopupService
                .open(FilterCriteriaDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
