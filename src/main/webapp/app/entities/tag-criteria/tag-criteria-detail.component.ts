import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { TagCriteria } from './tag-criteria.model';
import { TagCriteriaService } from './tag-criteria.service';

@Component({
    selector: 'jhi-tag-criteria-detail',
    templateUrl: './tag-criteria-detail.component.html'
})
export class TagCriteriaDetailComponent implements OnInit, OnDestroy {

    tagCriteria: TagCriteria;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tagCriteriaService: TagCriteriaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTagCriteria();
    }

    load(id) {
        this.tagCriteriaService.find(id).subscribe((tagCriteria) => {
            this.tagCriteria = tagCriteria;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTagCriteria() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tagCriteriaListModification',
            (response) => this.load(this.tagCriteria.id)
        );
    }
}
