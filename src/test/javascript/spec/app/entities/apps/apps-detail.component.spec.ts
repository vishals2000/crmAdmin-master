/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { AppsDetailComponent } from '../../../../../../main/webapp/app/entities/apps/apps-detail.component';
import { AppsService } from '../../../../../../main/webapp/app/entities/apps/apps.service';
import { Apps } from '../../../../../../main/webapp/app/entities/apps/apps.model';

describe('Component Tests', () => {

    describe('Apps Management Detail Component', () => {
        let comp: AppsDetailComponent;
        let fixture: ComponentFixture<AppsDetailComponent>;
        let service: AppsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [AppsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    AppsService,
                    JhiEventManager
                ]
            }).overrideTemplate(AppsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AppsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AppsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Apps('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.apps).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
