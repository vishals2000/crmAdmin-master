import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Apps } from './apps.model';
import { AppsService } from './apps.service';

@Component({
    selector: 'jhi-apps-detail',
    templateUrl: './apps-detail.component.html'
})
export class AppsDetailComponent implements OnInit, OnDestroy {

    apps: Apps;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private appsService: AppsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInApps();
    }

    load(id) {
        this.appsService.find(id).subscribe((apps) => {
            this.apps = apps;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInApps() {
        this.eventSubscriber = this.eventManager.subscribe(
            'appsListModification',
            (response) => this.load(this.apps.id)
        );
    }
}
