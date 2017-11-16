import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { Message } from 'primeng/components/common/api';
import { AppsService } from '../../entities/apps/apps.service';
import { Apps } from '../../entities/apps/apps.model';
import { ResponseWrapper } from '../../shared';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { INSIGHTS_URL } from '../../app.constants';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-linechart',
    templateUrl: './linechart.component.html',
    styles: []
})

export class LinechartComponent implements OnInit {
    data: any;
    msgs: Message[];
    chartHeading: string;
    myClass = [];
    startDate: any;
    endDate: any;
    startDateDp: any;
    endDateDp: any;
    minDate: NgbDateStruct;
    apps: Apps[];
    selectedApp: Apps;
    insightsData: any;
    messages: Number;
    dailyUniqueUsers: Number;
    totalUsers: Number;
    sessions: Number;

    public activeModal: NgbActiveModal;

    constructor(
        private appsService: AppsService,
        private http: HttpClient,
        private alertService: JhiAlertService,
    ) {
        this.chartHeading = 'Messages';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }

    ngOnInit() {
        this.appsService.query().subscribe((res: ResponseWrapper) => {
            this.apps = res.json;
        });

        const now = new Date();
        this.minDate = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
    }

    getData(app: Apps) {
        if (app) {
            const data = {
                'appId': app.id,
                'frontEnd': app.frontEnd,
                'product': app.product,
                'startDate': '2017-11-13',
                'endDate': '2017-11-25'
            }

            const req = this.http.post(INSIGHTS_URL,
                JSON.stringify(data), {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                })
            req.subscribe(
                (res: ResponseWrapper) => this.onInsightsSuccess(res, res),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        } else {
            console.log(app);
            this.alertService.error('Please select app from drop down list');
        }
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    private onInsightsSuccess(response, headers) {
        this.insightsData = response;
        this.messages = response.messages;
        this.sessions = response.sessions;
        this.dailyUniqueUsers = response.dailyUniqueUsers;
        this.totalUsers = response.totalUsers;
    }

    getMessages() {
        this.chartHeading = 'Messages';
        this.data = this.insightsData.dateVsMessageInfo;
    }

    getTotalUsers() {
        this.chartHeading = 'Total Users';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [32, 51, 80, 65, 68, 56, 41],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [21, 38, 50, 29, 56, 17, 60],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }
    getUniqueUsers() {
        this.chartHeading = 'Unique Users';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [45, 65, 78, 98, 68, 56, 41],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }
    getSessions() {
        this.chartHeading = 'Sessions';
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [24, 45, 28, 58, 60, 25, 84],
                    fill: false,
                    borderColor: '#4bc0c0'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        };
    }

    selectData(event) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index] });
    }
}
