/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { UploadSegmentsDetailComponent } from '../../../../../../main/webapp/app/entities/upload-segments/upload-segments-detail.component';
import { UploadSegmentsService } from '../../../../../../main/webapp/app/entities/upload-segments/upload-segments.service';
import { UploadSegments } from '../../../../../../main/webapp/app/entities/upload-segments/upload-segments.model';

describe('Component Tests', () => {

    describe('UploadSegments Management Detail Component', () => {
        let comp: UploadSegmentsDetailComponent;
        let fixture: ComponentFixture<UploadSegmentsDetailComponent>;
        let service: UploadSegmentsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [UploadSegmentsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    UploadSegmentsService,
                    JhiEventManager
                ]
            }).overrideTemplate(UploadSegmentsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UploadSegmentsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UploadSegmentsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new UploadSegments('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.uploadSegments).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
