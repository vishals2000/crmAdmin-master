import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Campaigns } from './campaigns.model';
import { CampaignsService } from './campaigns.service';

@Component({
    selector: 'jhi-campaigns-detail',
    templateUrl: './campaigns-detail.component.html'
})
export class CampaignsDetailComponent implements OnInit, OnDestroy {

    campaigns: Campaigns;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private campaignsService: CampaignsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCampaigns();
    }

    load(id) {
        this.campaignsService.find(id).subscribe((campaigns) => {
            this.campaigns = campaigns;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCampaigns() {
        this.eventSubscriber = this.eventManager.subscribe(
            'campaignsListModification',
            (response) => this.load(this.campaigns.id)
        );
    }
}
