import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { UserModalService } from './user-modal.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html'
})
export class UserMgmtDialogComponent implements OnInit {

    user: User;
    languages: any[];
    authorities: any[];
    isSaving: Boolean;
    allApps: any;
    selectedApps: any[];
    roleadmin: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) { }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = [];
        this.selectedApps = [];
        let userRole = this.user.authorities && this.user.authorities.length ? this.user.authorities[0] : '';
        this.user.authorities = [userRole];
        this.allApps = JSON.parse(localStorage['appList']) || [];
        if (this.allApps && this.user.applications && this.allApps.length === this.user.applications.length) {
            this.selectedApps = JSON.parse(localStorage['appList']) || [];
        }
        else if (this.user.applications && this.user.applications.length) {
            var aSelectedApps = [];
            for (let i = 0; i < this.user.applications.length; i++) {
                this.allApps.filter((obj) => {
                    if (obj.id === this.user.applications[i]) {
                        aSelectedApps.push(obj);
                    }
                });
            }
            this.selectedApps = aSelectedApps;
        }
        this.userService.authorities().subscribe((authorities) => {
            this.authorities = authorities;
            this.onAuthorityChange();
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.mapSelectedAppsToPost();
        this.user.authorities = [this.user.authorities];
        if (this.user.id !== null) {
            this.userService.update(this.user).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        } else {
            this.user.langKey = 'en';
            this.userService.create(this.user).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        }
    }

    mapSelectedAppsToPost() {
        var listOfSelApps = [];
        const useAuth = this.user.authorities;
        if(useAuth.indexOf("ROLE_ADMIN") > -1){
            this.user.applications = [];
        }
        else{
            for (var i = 0; i < this.selectedApps.length; i++) {
                listOfSelApps.push(this.selectedApps[i].id);
            }
            this.user.applications = listOfSelApps;
        } 
    }

    onAuthorityChange(){
        const useAuth = this.user.authorities;
        if(useAuth && useAuth.indexOf("ROLE_ADMIN") > -1){
            this.roleadmin = true;
        }
        else{
            this.roleadmin = false;
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'userListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-user-dialog',
    template: ''
})
export class UserDialogComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userModalService: UserModalService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['login']) {
                this.userModalService.open(UserMgmtDialogComponent as Component, params['login']);
            } else {
                this.userModalService.open(UserMgmtDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
