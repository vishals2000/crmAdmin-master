import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { CampaignStat } from './campaign-stat.model';
import { CampaignStatService } from './campaign-stat.service';

@Component({
    selector: 'jhi-campaign-stat-detail',
    templateUrl: './campaign-stat-detail.component.html'
})
export class CampaignStatDetailComponent implements OnInit, OnDestroy {

    campaignStat: CampaignStat;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private campaignStatService: CampaignStatService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCampaignStats();
    }

    load(id) {
        this.campaignStatService.find(id).subscribe((campaignStat) => {
            this.campaignStat = campaignStat;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCampaignStats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'campaignStatListModification',
            (response) => this.load(this.campaignStat.id)
        );
    }
}
