/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { FeProductDetailComponent } from '../../../../../../main/webapp/app/entities/fe-product/fe-product-detail.component';
import { FeProductService } from '../../../../../../main/webapp/app/entities/fe-product/fe-product.service';
import { FeProduct } from '../../../../../../main/webapp/app/entities/fe-product/fe-product.model';

describe('Component Tests', () => {

    describe('FeProduct Management Detail Component', () => {
        let comp: FeProductDetailComponent;
        let fixture: ComponentFixture<FeProductDetailComponent>;
        let service: FeProductService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [FeProductDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    FeProductService,
                    JhiEventManager
                ]
            }).overrideTemplate(FeProductDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FeProductDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FeProductService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new FeProduct('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.feProduct).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
