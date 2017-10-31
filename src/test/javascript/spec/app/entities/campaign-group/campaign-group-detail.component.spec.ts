/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CampaignGroupDetailComponent } from '../../../../../../main/webapp/app/entities/campaign-group/campaign-group-detail.component';
import { CampaignGroupService } from '../../../../../../main/webapp/app/entities/campaign-group/campaign-group.service';
import { CampaignGroup } from '../../../../../../main/webapp/app/entities/campaign-group/campaign-group.model';

describe('Component Tests', () => {

    describe('CampaignGroup Management Detail Component', () => {
        let comp: CampaignGroupDetailComponent;
        let fixture: ComponentFixture<CampaignGroupDetailComponent>;
        let service: CampaignGroupService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [CampaignGroupDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CampaignGroupService,
                    JhiEventManager
                ]
            }).overrideTemplate(CampaignGroupDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CampaignGroupDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CampaignGroupService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CampaignGroup('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.campaignGroup).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
