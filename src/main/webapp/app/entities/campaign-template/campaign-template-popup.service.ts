import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplateService } from './campaign-template.service';

@Injectable()
export class CampaignTemplatePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private campaignTemplateService: CampaignTemplateService

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
                this.campaignTemplateService.find(id).subscribe((campaignTemplate) => {
                    if (campaignTemplate.startDate) {
                        campaignTemplate.startDate = {
                            year: campaignTemplate.startDate.getFullYear(),
                            month: campaignTemplate.startDate.getMonth() + 1,
                            day: campaignTemplate.startDate.getDate()
                        };
                    }
                    if (campaignTemplate.recurrenceEndDate) {
                        campaignTemplate.recurrenceEndDate = {
                            year: campaignTemplate.recurrenceEndDate.getFullYear(),
                            month: campaignTemplate.recurrenceEndDate.getMonth() + 1,
                            day: campaignTemplate.recurrenceEndDate.getDate()
                        };
                    }
                    this.ngbModalRef = this.campaignTemplateModalRef(component, campaignTemplate);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.campaignTemplateModalRef(component, new CampaignTemplate());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    campaignTemplateModalRef(component: Component, campaignTemplate: CampaignTemplate): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.campaignTemplate = campaignTemplate;
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
