import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { User, UserService } from '../../shared';

@Injectable()
export class UserModalService {
    private isOpen = false;
    private ngbModalRef: NgbModalRef;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private userService: UserService
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, login?: string): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (login) {
            this.userService.find(login).subscribe((user) => {
                this.ngbModalRef = this.userModalRef(component, user);
                resolve(this.ngbModalRef);
            });
        } else {
             // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
             setTimeout(() => {
                 this.ngbModalRef = this.userModalRef(component, new User());;
                 resolve(this.ngbModalRef);
             });
        }
    });
    }

    userModalRef(component: Component, user: User): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.user = user;      
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
            this.isOpen = false;
        });
        return modalRef;
    }
}
