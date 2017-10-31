/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { CrmAdminTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MessageContentDetailComponent } from '../../../../../../main/webapp/app/entities/message-content/message-content-detail.component';
import { MessageContentService } from '../../../../../../main/webapp/app/entities/message-content/message-content.service';
import { MessageContent } from '../../../../../../main/webapp/app/entities/message-content/message-content.model';

describe('Component Tests', () => {

    describe('MessageContent Management Detail Component', () => {
        let comp: MessageContentDetailComponent;
        let fixture: ComponentFixture<MessageContentDetailComponent>;
        let service: MessageContentService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CrmAdminTestModule],
                declarations: [MessageContentDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    MessageContentService,
                    JhiEventManager
                ]
            }).overrideTemplate(MessageContentDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MessageContentDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MessageContentService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new MessageContent('aaa')));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.messageContent).toEqual(jasmine.objectContaining({id: 'aaa'}));
            });
        });
    });

});
