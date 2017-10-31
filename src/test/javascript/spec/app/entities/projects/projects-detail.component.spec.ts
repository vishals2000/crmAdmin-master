/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ProjectsDetailComponent } from '../../../../../../main/webapp/app/entities/projects/projects-detail.component';
import { ProjectsService } from '../../../../../../main/webapp/app/entities/projects/projects.service';
import { Projects } from '../../../../../../main/webapp/app/entities/projects/projects.model';

describe('Component Tests', () => {

    describe('Projects Management Detail Component', () => {
        let comp: ProjectsDetailComponent;
        let fixture: ComponentFixture<ProjectsDetailComponent>;
        let service: ProjectsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [ProjectsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ProjectsService,
                    JhiEventManager
                ]
            }).overrideTemplate(ProjectsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProjectsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProjectsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Projects('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.projects).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
