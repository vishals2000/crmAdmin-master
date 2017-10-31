import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FilterCriteria } from './filter-criteria.model';
import { FilterCriteriaService } from './filter-criteria.service';

@Injectable()
export class FilterCriteriaPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private filterCriteriaService: FilterCriteriaService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.filterCriteriaService.find(id).subscribe((filterCriteria) => {
                    this.ngbModalRef = this.filterCriteriaModalRef(component, filterCriteria);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.filterCriteriaModalRef(component, new FilterCriteria());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    filterCriteriaModalRef(component: Component, filterCriteria: FilterCriteria): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.filterCriteria = filterCriteria;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
