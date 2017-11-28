/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { AudienceSegmentsDetailComponent } from '../../../../../../main/webapp/app/entities/audience-segments/audience-segments-detail.component';
import { AudienceSegmentsService } from '../../../../../../main/webapp/app/entities/audience-segments/audience-segments.service';
import { AudienceSegments } from '../../../../../../main/webapp/app/entities/audience-segments/audience-segments.model';

describe('Component Tests', () => {

    describe('AudienceSegments Management Detail Component', () => {
        let comp: AudienceSegmentsDetailComponent;
        let fixture: ComponentFixture<AudienceSegmentsDetailComponent>;
        let service: AudienceSegmentsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [AudienceSegmentsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    AudienceSegmentsService,
                    JhiEventManager
                ]
            }).overrideTemplate(AudienceSegmentsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AudienceSegmentsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AudienceSegmentsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new AudienceSegments('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.audienceSegments).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
