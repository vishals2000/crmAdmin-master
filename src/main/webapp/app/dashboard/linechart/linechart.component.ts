import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { Message } from 'primeng/components/common/api';
//import { AppsService } from '../../entities/apps/apps.service';
import { Apps } from '../../entities/apps/apps.model';
import { ResponseWrapper } from '../../shared';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { INSIGHTS_URL } from '../../app.constants';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiAlertService } from 'ng-jhipster';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { setTimeout } from 'timers';

@Component({
    selector: 'jhi-linechart',
    templateUrl: './linechart.component.html',
    styles: [],
    host: {
        '(document:click)': 'onClick($event)',
    }
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
    routeData: any;
    segName: any;
    selected: string;
    month_names_short: string[];
    eventSubscriber: Subscription;
    app: any;
    dynamicId: any;

    public activeModal: NgbActiveModal;
    private subscription: Subscription;
    appId: any;
    constructor(
        // private appsService: AppsService,
        private http: HttpClient,
        private alertService: JhiAlertService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private parseLinks: JhiParseLinks,
        private paginationUtil: JhiPaginationUtil,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
    ) {
        this.month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.segName = data && data['pagingParams'] ? data['pagingParams'].segName : '';
        });
    }
    onClick(event) {
        if(this.dynamicId  && !event.target.parentElement.closest(".datePickerClass")) {
          setTimeout(() => {
              this.dynamicId.close();
              this.dynamicId = null; 
          }, 0);
        }
    }

    ngOnInit() {
        let dateObj = new Date();
        const todayDt1 = {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate()
        };
        dateObj.setDate(dateObj.getDate() - 7);
        const aWEekAgo = {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate()
        };
        this.startDate = aWEekAgo;
        this.endDate = todayDt1;
        this.subscription = this.route.params.subscribe((params) => {
            this.appId = params['id'];
            if (this.appId) {
                let cbk = () => {
                    this.setDataToPageModel();
                };
                this.eventManager.broadcast({ name: 'setBreadCrumbToInsights', content: {appId: this.appId}, callBackFunction: cbk });
            }
            else {
                this.eventManager.broadcast({ name: 'setBreadCrumbToInsightsFirstApp', content: 'OK' });
            }
        });
    }

    setDataToPageModel() {
        if(sessionStorage['selectedApp']){
            var obj = JSON.parse(sessionStorage['selectedApp']);
            this.app = {
                product: obj.product,
                frontEnd: obj.frontEnd,
                id: obj.id
            };
            this.getData(this.app);
            const now = new Date();
            this.minDate = {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate()
            };
        }
        else{
            this.router.navigate(['/apps'], {});
        }
    }
    onDtChange(){
        var ocurrObj = this;
        setTimeout(function(){
            ocurrObj.getData(ocurrObj.app);
        }, 0);
    }
    getData(app: Apps) {
        if (app) {
            const data = {
                'appId': app.id,
                'frontEnd': app.frontEnd,
                'product': app.product,
                'startDate': this.startDate.year + "-" + (this.startDate.month < 9 ? '0' : '') + this.startDate.month + "-" + (this.startDate.day < 9 ? '0' : '') + this.startDate.day,
                'endDate': this.endDate.year + "-" + (this.endDate.month < 9 ? '0' : '') + this.endDate.month + "-" + (this.endDate.day < 9 ? '0' : '') + this.endDate.day
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
            this.onError({ message: 'Please select app from drop down list' });
        }
    }

    private onError(error) {
        this.alertService.error((error && error.message ? error.message : error), null, null);
        // this.eventManager.broadcast({ name: 'selectedApp', content: this.appId });
        //this.eventManager.broadcast({ name: 'setBreadCrumbToInsights', content: {appId: this.appId} });
    }

    private onInsightsSuccess(response, headers) {
        this.insightsData = response;
        this.messages = response.messages;
        this.sessions = response.sessions;
        this.dailyUniqueUsers = response.dailyUniqueUsers;
        this.totalUsers = response.totalUsers;
        //this.eventManager.broadcast({ name: 'selectedApp', content: this.appId });
        //this.eventManager.broadcast({ name: 'setBreadCrumbToInsights', content: {appId: this.appId} });
        this.getMessages();
    }

    getMessages() {
        this.selected = 'M';
        let data = {
            labels: [],
            datasets: []
        };
        let dataSetObj = {
            label: 'Reach',
            data: [],
            fill: false,
            borderColor: '#673AB7'
        };
        let dataSetObj1 = {
            label: 'Engagement',
            data: [],
            fill: false,
            borderColor: '#24B661'
        };
        if (this.insightsData && this.insightsData.dateVsMessageInfo && this.insightsData.dateVsMessageInfo) {
            for (let key in this.insightsData.dateVsMessageInfo) {
                var dt = new Date(key);
                data.labels.push(dt.getDate() + ' ' + this.month_names_short[dt.getMonth()]);
                dataSetObj.data.push(parseInt(this.insightsData.dateVsMessageInfo[key].reach));
                dataSetObj1.data.push(parseInt(this.insightsData.dateVsMessageInfo[key].engagement));
            }
        }
        data.datasets.push(dataSetObj);
        data.datasets.push(dataSetObj1);
        this.chartHeading = 'Messages';
        this.data = data;
    }

    getTotalUsers() {
        this.selected = 'T';
        // this.chartHeading = 'Total Users';
        // this.data = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //     datasets: [
        //         {
        //             label: 'First Dataset',
        //             data: [32, 51, 80, 65, 68, 56, 41],
        //             fill: false,
        //             borderColor: '#4bc0c0'
        //         },
        //         {
        //             label: 'Second Dataset',
        //             data: [21, 38, 50, 29, 56, 17, 60],
        //             fill: false,
        //             borderColor: '#565656'
        //         }
        //     ]
        // };
    }
    getUniqueUsers() {
        this.selected = 'U';
        let data = {
            labels: [],
            datasets: []
        };
        let dataSetObj = {
            label: 'Active Users',
            data: [],
            fill: false,
            borderColor: '#4bc0c0'
        };
        if (this.insightsData && this.insightsData.dateVsUniqueUsers && this.insightsData.dateVsUniqueUsers) {
            for (let key in this.insightsData.dateVsUniqueUsers) {
                var dt = new Date(key);
                data.labels.push(dt.getDate() + ' ' + this.month_names_short[dt.getMonth()]);
                dataSetObj.data.push(parseInt(this.insightsData.dateVsUniqueUsers[key]));
            }
        }
        data.datasets.push(dataSetObj);
        this.chartHeading = 'Unique Users';
        this.data = data;
    }
    // kFormatter(num) {
    //     return num > 999 ? (num/1000).toFixed(1) + 'k' : num
    // }
    getSessions() {
        this.selected = 'S';
        let data = {
            labels: [],
            datasets: []
        };
        let dataSetObj = {
            label: 'Organic Sesssions',
            data: [],
            fill: false,
            borderColor: '#565656'
        };
        if (this.insightsData && this.insightsData.dateVsSessions && this.insightsData.dateVsSessions) {
            for (let key in this.insightsData.dateVsSessions) {
                var dt = new Date(key);
                data.labels.push(dt.getDate() + ' ' + this.month_names_short[dt.getMonth()]);
                dataSetObj.data.push(parseInt(this.insightsData.dateVsSessions[key]));
            }
        }
        data.datasets.push(dataSetObj);
        this.chartHeading = 'Sessions';
        this.data = data;
    }

    selectData(event) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index] });
    }
    openDatepicker(id){
        if(this.dynamicId){
            this.dynamicId.close();
            this.dynamicId = null;
        }
        this.dynamicId = id;
    }
}
