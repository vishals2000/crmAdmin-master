/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { FilterCriteriaDetailComponent } from '../../../../../../main/webapp/app/entities/filter-criteria/filter-criteria-detail.component';
import { FilterCriteriaService } from '../../../../../../main/webapp/app/entities/filter-criteria/filter-criteria.service';
import { FilterCriteria } from '../../../../../../main/webapp/app/entities/filter-criteria/filter-criteria.model';

describe('Component Tests', () => {

    describe('FilterCriteria Management Detail Component', () => {
        let comp: FilterCriteriaDetailComponent;
        let fixture: ComponentFixture<FilterCriteriaDetailComponent>;
        let service: FilterCriteriaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [FilterCriteriaDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    FilterCriteriaService,
                    JhiEventManager
                ]
            }).overrideTemplate(FilterCriteriaDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FilterCriteriaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FilterCriteriaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FilterCriteria('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.filterCriteria).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
