/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CampaignTemplateDetailComponent } from '../../../../../../main/webapp/app/entities/campaign-template/campaign-template-detail.component';
import { CampaignTemplateService } from '../../../../../../main/webapp/app/entities/campaign-template/campaign-template.service';
import { CampaignTemplate } from '../../../../../../main/webapp/app/entities/campaign-template/campaign-template.model';

describe('Component Tests', () => {

    describe('CampaignTemplate Management Detail Component', () => {
        let comp: CampaignTemplateDetailComponent;
        let fixture: ComponentFixture<CampaignTemplateDetailComponent>;
        let service: CampaignTemplateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [CampaignTemplateDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CampaignTemplateService,
                    JhiEventManager
                ]
            }).overrideTemplate(CampaignTemplateDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CampaignTemplateDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CampaignTemplateService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CampaignTemplate('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.campaignTemplate).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
