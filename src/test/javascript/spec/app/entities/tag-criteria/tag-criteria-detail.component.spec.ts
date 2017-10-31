/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { TagCriteriaDetailComponent } from '../../../../../../main/webapp/app/entities/tag-criteria/tag-criteria-detail.component';
import { TagCriteriaService } from '../../../../../../main/webapp/app/entities/tag-criteria/tag-criteria.service';
import { TagCriteria } from '../../../../../../main/webapp/app/entities/tag-criteria/tag-criteria.model';

describe('Component Tests', () => {

    describe('TagCriteria Management Detail Component', () => {
        let comp: TagCriteriaDetailComponent;
        let fixture: ComponentFixture<TagCriteriaDetailComponent>;
        let service: TagCriteriaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [TagCriteriaDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    TagCriteriaService,
                    JhiEventManager
                ]
            }).overrideTemplate(TagCriteriaDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TagCriteriaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TagCriteriaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new TagCriteria('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.tagCriteria).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
