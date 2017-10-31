import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Projects } from './projects.model';
import { ProjectsPopupService } from './projects-popup.service';
import { ProjectsService } from './projects.service';

@Component({
    selector: 'jhi-projects-dialog',
    templateUrl: './projects-dialog.component.html'
})
export class ProjectsDialogComponent implements OnInit {

    projects: Projects;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private projectsService: ProjectsService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.projects.id !== undefined) {
            this.subscribeToSaveResponse(
                this.projectsService.update(this.projects));
        } else {
            this.subscribeToSaveResponse(
                this.projectsService.create(this.projects));
        }
    }

    private subscribeToSaveResponse(result: Observable<Projects>) {
        result.subscribe((res: Projects) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Projects) {
        this.eventManager.broadcast({ name: 'projectsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-projects-popup',
    template: ''
})
export class ProjectsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private projectsPopupService: ProjectsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.projectsPopupService
                    .open(ProjectsDialogComponent as Component, params['id']);
            } else {
                this.projectsPopupService
                    .open(ProjectsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
