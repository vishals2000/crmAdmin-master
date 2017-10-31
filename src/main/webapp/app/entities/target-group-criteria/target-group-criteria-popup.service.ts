import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TargetGroupCriteria } from './target-group-criteria.model';
import { TargetGroupCriteriaService } from './target-group-criteria.service';

@Injectable()
export class TargetGroupCriteriaPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private targetGroupCriteriaService: TargetGroupCriteriaService

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
                this.targetGroupCriteriaService.find(id).subscribe((targetGroupCriteria) => {
                    this.ngbModalRef = this.targetGroupCriteriaModalRef(component, targetGroupCriteria);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.targetGroupCriteriaModalRef(component, new TargetGroupCriteria());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    targetGroupCriteriaModalRef(component: Component, targetGroupCriteria: TargetGroupCriteria): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.targetGroupCriteria = targetGroupCriteria;
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
