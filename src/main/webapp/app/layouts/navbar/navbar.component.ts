import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';

import { ProfileService } from '../profiles/profile.service';
import { Principal, LoginModalService, LoginService, ResponseWrapper, ITEMS_PER_PAGE } from '../../shared';

import { BreadCrumbService } from './navbar.service';

import { VERSION, DEBUG_INFO_ENABLED } from '../../app.constants';
import { AppsService } from '../../entities/apps/apps.service';
import { CampaignGroupService } from '../../entities/campaign-group/campaign-group.service';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        'navbar.css'
    ]
})
@Injectable()
export class NavbarComponent implements OnInit {

    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    appList: any[];
    selApp: any;
    campGrpList: any[];
    crumbsArray: any[];
    eventSubscriber: Subscription;
    appPageType: string;
    selCampGrp: any;

    constructor(
        private loginService: LoginService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private breadCrumbService: BreadCrumbService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private appsService: AppsService,
        private campaignGroupService: CampaignGroupService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }
    loadAllApps(fcbk) {
        let oCurObj = this;
        let fAfterGetResults = function (res) {
            oCurObj.eventManager.broadcast({ name: 'appListModified', content: res.json })
            fcbk && fcbk();
        };
        if (!this.appList || this.appList.length === 0) {
            this.appsService.queryAll({}).subscribe((res: ResponseWrapper) => fAfterGetResults(res));
        } else {
            fcbk && fcbk();
        }
    }
    loadSelAppCampGrp() {
        if ((!this.campGrpList || this.campGrpList.length === 0) && this.selApp) {
            this.campaignGroupService.queryAll({ appId: this.selApp.id }).subscribe((res: ResponseWrapper) =>
                this.eventManager.broadcast({ name: 'campaignGroupListModified', content: res.json })
            );
        }
    }
    ngOnInit() {
        let oCurObj = this;
        oCurObj.registerSubscribers();
        let fAfterGetResults = function (res) {
            oCurObj.profileService.getProfileInfo().subscribe((profileInfo) => {
                oCurObj.inProduction = profileInfo.inProduction;
                oCurObj.swaggerEnabled = profileInfo.swaggerEnabled;
            });
        };
        this.loadAllApps(fAfterGetResults);
    }
    registerSubscribers() {
        this.eventSubscriber = this.eventManager.subscribe('appListModified', response => this.setAppDataToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('selectedApp', response => this.setAppSelAppToBreadCrumbModel(response));

        this.eventSubscriber = this.eventManager.subscribe('campaignGroupListModified', response => this.setCampGrpDataToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('selectedCampGrp', response => this.setAppSelCampGrpToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToApp', response => this.setBreadCrumbToApp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampGrp', response => this.setBreadCrumbToCampGrp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampTemp', response => this.setBreadCrumbToCampTemp(response));

        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToAudSeg', response => this.setBreadCrumbToAudSeg(response, false));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToInsights', response => this.setBreadCrumbToInsights(response, null));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToInsightsFirstApp', response => this.setBreadCrumbToInsights(response, true));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToAudSegFirstApp', response => this.setBreadCrumbToAudSeg(response, true));

        this.eventSubscriber = this.eventManager.subscribe('clearBdData', response => this.clearBdData(response));
    }
    clearBdData(res) {
        this.crumbsArray = [];
    }
    setAppDataToBreadCrumbModel(appListModified) {
        this.appList = appListModified.content || [];
        for (let i = 0; i < this.appList.length; i++) {
            this.appList[i].itemName = this.appList[i].name;
        }
        localStorage['appList'] = JSON.stringify(this.appList);
    }
    setAppSelAppToBreadCrumbModel(appSelected) {
        let AppId = appSelected.content;
        let oCurObj = this;
        let fAfterGetResults = function (res) {
            for (let i = 0; i < oCurObj.appList.length; i++) {
                if (oCurObj.appList[i].id === AppId || !AppId) {
                    oCurObj.selApp = oCurObj.appList[i];
                    oCurObj.selApp.itemName = oCurObj.selApp.name;
                    localStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
                    break;
                }
            }
        }
        this.loadAllApps(fAfterGetResults);
    }
    setCampGrpDataToBreadCrumbModel(campGrpListModified) {
        this.campGrpList = campGrpListModified.content || [];
        for (let i = 0; i < this.campGrpList.length; i++) {
            this.campGrpList[i].itemName = this.campGrpList[i].name;
        }
        this.eventManager.broadcast({ name: 'campGrpDataReady', content: 'OK' });
    }
    setAppSelCampGrpToBreadCrumbModel(campGrpSelected) {
        let campGrpId = campGrpSelected.content;
        this.loadSelAppCampGrp();
        if (this.campGrpList) {
            for (let i = 0; i < this.campGrpList.length; i++) {
                if (this.campGrpList[i].id === campGrpId) {
                    this.selCampGrp = this.campGrpList[i];
                    this.selCampGrp.itemName = this.selCampGrp.name;
                    this.eventManager.broadcast({ name: 'campaignGroupDataReady', content: 'OK' });
                    break;
                }
            }
        } else {

        }
    }
    setBreadCrumbToApp(response) {
        this.appPageType = 'app';
        this.crumbsArray = [{ name: 'Apps', router: '#/apps', brdCrmbId: '1', list: [], selVal: [] }];
    }
    setBreadCrumbToCampGrp(response) {
        this.setBreadCrumbToApp(response);
        if (this.appList && this.appList.length) {
            if (!this.selApp) {
                this.selApp = this.appList[0];
                localStorage['selectedApp'] = JSON.stringify(this.selApp);
            }
            this.appPageType = 'app-CG';
            this.crumbsArray.push({
                appPageType: this.appPageType,
                name: 'Campaigns',
                router: '#/campaign-group/project/' + this.selApp.id + '/' + this.selApp.name, brdCrmbId: '2',
                list: this.appList,
                selVal: [this.selApp]
            });
        }
    }
    setBreadCrumbToCampTemp(response) {
        this.setBreadCrumbToCampGrp(response);
        if (this.campGrpList && this.campGrpList.length) {
            if (response.content.campGrpId && !this.selCampGrp) {
                this.eventManager.broadcast({ name: 'selectedCampGrp', content: response.content.campGrpId });
            } else {
                this.appPageType = 'app-CT';
                this.crumbsArray.push({
                    appPageType: this.appPageType,
                    name: 'Messages',
                    router: '#/campaign-template/group/' + this.selCampGrp.id + '/' + this.selCampGrp.name,
                    brdCrmbId: '2',
                    list: this.campGrpList,
                    selVal: [this.selCampGrp]
                });
            }
        }
    }
    setBreadCrumbToAudSeg(response, bIsselectedFirstApp) {
        let oCurObj = this;
        let fAfterGetResults = function (res) {
            oCurObj.setBreadCrumbToApp(response);
            if (!oCurObj.selApp || bIsselectedFirstApp) {
                oCurObj.selApp = oCurObj.appList[0];
                localStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
            }
            if (oCurObj.appList && oCurObj.appList.length) {
                oCurObj.appPageType = 'AS';
                oCurObj.crumbsArray.push({
                    appPageType: oCurObj.appPageType,
                    name: 'Audience Segments',
                    router: '#/audience-segments/project/' + oCurObj.selApp.id,
                    brdCrmbId: '2', list: oCurObj.appList,
                    selVal: [oCurObj.selApp]
                });
            }
            if (bIsselectedFirstApp) {
                oCurObj.router.navigate(['/audience-segments/project/' + oCurObj.selApp.id], {});
            }
        };
        this.loadAllApps(fAfterGetResults);
    }
    setBreadCrumbToInsights(response, bIsselectedFirstApp) {
        let oCurObj = this;
        let fAfterGetResults = function (res) {
            oCurObj.setBreadCrumbToApp(response);
            if (!oCurObj.selApp || bIsselectedFirstApp) {
                oCurObj.selApp = oCurObj.appList[0];
                localStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
            }
            oCurObj.appPageType = 'INS';
            oCurObj.crumbsArray.push({
                appPageType: oCurObj.appPageType,
                name: 'Insights',
                router: '#/linechart/project/' + oCurObj.selApp.name,
                brdCrmbId: '2',
                list: oCurObj.appList,
                selVal: [oCurObj.selApp]
            });
            if (bIsselectedFirstApp) {
                oCurObj.router.navigate(['/linechart/project/' + oCurObj.selApp.id], {});
            }
        };
        this.loadAllApps(fAfterGetResults);
    }
    goToLineItemPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.selApp) {
            this.router.navigate(['/linechart/project/' + this.selApp.id], {});
        } else if (this.appList && this.appList.length) {
            localStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            this.router.navigate(['/linechart/project/' + this.appList[0].id], {});
        } else {
            this.loadAllApps(function () {
                localStorage['selectedApp'] = JSON.stringify(this.appList[0]);
                oCurObj.router.navigate(['/linechart/project/' + oCurObj.appList[0].id], {});
            })
        }
    }
    goToCampStatPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.appList && this.appList.length) {

            this.router.navigate(['/campaign-stat/'], {});
        } else {
            this.loadAllApps(function () {
                oCurObj.router.navigate(['/campaign-stat/'], {});
            })
        }
    }
    goToSegAudPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.selApp) {
            this.router.navigate(['/audience-segments/project/' + this.selApp.id], {});
        } else if (this.appList && this.appList.length) {
            localStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            this.router.navigate(['/audience-segments/project/' + this.appList[0].id], {});
        } else {
            this.loadAllApps(function () {
                localStorage['selectedApp'] = JSON.stringify(this.appList[0]);
                oCurObj.router.navigate(['/audience-segments/project/' + oCurObj.appList[0].id], {});
            })
        }
    }
    collapseNavbar() {
        this.crumbsArray = [];
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.eventManager.broadcast({
            name: 'clearBdData', content: 'Sending Authentication Req'
        });
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }
    onItemDeSelect(oSelectedItm, crumb) {
        crumb.selVal = [oSelectedItm];
        document.body.focus();
    }
    onItemSelect(oSelectedItm, appPageType) {
        switch (appPageType) {
            case 'app-CT':
                this.selCampGrp = oSelectedItm;
                this.router.navigate(['/campaign-template/group/' + this.selCampGrp.id + '/' + this.selCampGrp.name], {});
                break;
            case 'INS':
                localStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.selApp = oSelectedItm;
                this.router.navigate(['/linechart/project/' + this.selApp.id], {});
                break;
            case 'app-CG':
                localStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.selApp = oSelectedItm;
                this.router.navigate(['/campaign-group/project/' + this.selApp.id + '/' + this.selApp.name], {});
                break;
            case 'AS':
                this.selApp = oSelectedItm;
                localStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.router.navigate(['/audience-segments/project/' + this.selApp.id], {});
                break;
        }
    }
    ngOnDestroy() {
    }
}
