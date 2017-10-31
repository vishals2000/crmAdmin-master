/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CampaignsDetailComponent } from '../../../../../../main/webapp/app/entities/campaigns/campaigns-detail.component';
import { CampaignsService } from '../../../../../../main/webapp/app/entities/campaigns/campaigns.service';
import { Campaigns } from '../../../../../../main/webapp/app/entities/campaigns/campaigns.model';

describe('Component Tests', () => {

    describe('Campaigns Management Detail Component', () => {
        let comp: CampaignsDetailComponent;
        let fixture: ComponentFixture<CampaignsDetailComponent>;
        let service: CampaignsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [CampaignsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CampaignsService,
                    JhiEventManager
                ]
            }).overrideTemplate(CampaignsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CampaignsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CampaignsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Campaigns('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.campaigns).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
