/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { EventCriteriaDetailComponent } from '../../../../../../main/webapp/app/entities/event-criteria/event-criteria-detail.component';
import { EventCriteriaService } from '../../../../../../main/webapp/app/entities/event-criteria/event-criteria.service';
import { EventCriteria } from '../../../../../../main/webapp/app/entities/event-criteria/event-criteria.model';

describe('Component Tests', () => {

    describe('EventCriteria Management Detail Component', () => {
        let comp: EventCriteriaDetailComponent;
        let fixture: ComponentFixture<EventCriteriaDetailComponent>;
        let service: EventCriteriaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [EventCriteriaDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    EventCriteriaService,
                    JhiEventManager
                ]
            }).overrideTemplate(EventCriteriaDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventCriteriaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventCriteriaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new EventCriteria('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.eventCriteria).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
