import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { CampaignGroup } from './campaign-group.model';
import { CampaignGroupService } from './campaign-group.service';

@Component({
    selector: 'jhi-campaign-group-detail',
    templateUrl: './campaign-group-detail.component.html'
})
export class CampaignGroupDetailComponent implements OnInit, OnDestroy {

    campaignGroup: CampaignGroup;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private campaignGroupService: CampaignGroupService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCampaignGroups();
    }

    load(id) {
        this.campaignGroupService.find(id).subscribe((campaignGroup) => {
            this.campaignGroup = campaignGroup;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCampaignGroups() {
        this.eventSubscriber = this.eventManager.subscribe(
            'campaignGroupListModification',
            (response) => this.load(this.campaignGroup.id)
        );
    }
}
