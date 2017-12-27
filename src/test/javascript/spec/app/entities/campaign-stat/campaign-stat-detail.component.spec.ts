/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CampaignStatDetailComponent } from '../../../../../../main/webapp/app/entities/campaign-stat/campaign-stat-detail.component';
import { CampaignStatService } from '../../../../../../main/webapp/app/entities/campaign-stat/campaign-stat.service';
import { CampaignStat } from '../../../../../../main/webapp/app/entities/campaign-stat/campaign-stat.model';

describe('Component Tests', () => {

    describe('CampaignStat Management Detail Component', () => {
        let comp: CampaignStatDetailComponent;
        let fixture: ComponentFixture<CampaignStatDetailComponent>;
        let service: CampaignStatService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [CampaignStatDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CampaignStatService,
                    JhiEventManager
                ]
            }).overrideTemplate(CampaignStatDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CampaignStatDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CampaignStatService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CampaignStat('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.campaignStat).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
