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
    currentAccount: any;
    selAppId: any;
    selCampaignGrpId: any;

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
        if (sessionStorage['appList']) {
            this.appList = JSON.parse(sessionStorage['appList']);
            fcbk && fcbk();
        } else if (!sessionStorage['appList']) {
            this.appList = [];
            this.appsService.queryAll({}).subscribe((res: ResponseWrapper) => fAfterGetResults(res));
        } else if (!this.appList || this.appList.length === 0) {
            this.appsService.queryAll({}).subscribe((res: ResponseWrapper) => fAfterGetResults(res));
        } else {
            fcbk && fcbk();
        }
    }
    loadSelAppCampGrp(fcbk) {
        let oCurObj = this;
        if (this.selApp || this.selAppId) {
            let fAfterGetResults = function (res) {
                oCurObj.campGrpList = res.json;
                for(let i=0;i<oCurObj.campGrpList.length;i++){
                    oCurObj.campGrpList[i].itemName = oCurObj.campGrpList[i].name;
                }
                fcbk && fcbk();
            };
            this.campaignGroupService.queryAll({ appId: (this.selApp.id || this.selAppId) }).subscribe((res: ResponseWrapper) => fAfterGetResults(res));
        }
    }
    ngOnInit() {
        this.currentAccount = null;
        let oCurObj = this;
        let fAfterGetResults = function (res) {
            oCurObj.profileService.getProfileInfo().subscribe((profileInfo) => {
                oCurObj.inProduction = profileInfo.inProduction;
                oCurObj.swaggerEnabled = profileInfo.swaggerEnabled;
            });
        };
        console.log("call every time");
        this.loadAllAppsForeFully(null);
        if (!this.currentAccount) {
            this.loggedInSucces(null);
        }
        oCurObj.registerSubscribers();
    }
    loadAllAppsForeFully(res) {
        this.appList = null;
        this.selApp = null;
        this.selAppId = null;
        sessionStorage.removeItem("appList");
        this.loadAllApps(null);
    }
    loadAllCampaignGrpsForceFully(res) {
        this.selCampaignGrpId = null;
        this.selCampGrp = null;
        this.campGrpList = null;
    }
    registerSubscribers() {
        this.eventSubscriber = this.eventManager.subscribe('appsListModification', response => this.loadAllAppsForeFully(response));
        this.eventSubscriber = this.eventManager.subscribe('appListModified', response => this.setAppDataToBreadCrumbModel(response));

        this.eventSubscriber = this.eventManager.subscribe('campaignGroupListModification', response => this.loadAllCampaignGrpsForceFully(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToApp', response => this.setBreadCrumbToApp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampGrp', response => this.setBreadCrumbToCampGrp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampTemp', response => this.setBreadCrumbToCampTemp(response));

        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToAudSeg', response => this.setBreadCrumbToAudSeg(response, false));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToInsights', response => this.setBreadCrumbToInsights(response, null));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToInsightsFirstApp', response => this.setBreadCrumbToInsights(response, true));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToAudSegFirstApp', response => this.setBreadCrumbToAudSeg(response, true));

        this.eventSubscriber = this.eventManager.subscribe('clearBdData', response => this.clearBdData(response));
        this.eventSubscriber = this.eventManager.subscribe('authenticationSuccess', response => this.loggedInSucces(response));
    }
    loggedInSucces(res) {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }
    clearBdData(res) {
        this.crumbsArray = [];
    }
    setAppDataToBreadCrumbModel(appListModified) {
        this.appList = appListModified.content || [];
        for (let i = 0; i < this.appList.length; i++) {
            this.appList[i].itemName = this.appList[i].name;
        }
        sessionStorage['appList'] = JSON.stringify(this.appList);
    }
    setAppSelAppToBreadCrumbModel(appSelected, fAfterGetList) {
        let oCurObj = this;
        let AppId = decodeURI(appSelected);
        let fAfterFoundSelApp = function () {
            let notFoundCount = 0;
            for (let i = 0; oCurObj.appList && i < oCurObj.appList.length; i++) {
                if (oCurObj.appList[i].id === AppId || !AppId) {
                    oCurObj.selApp = oCurObj.appList[i];
                    oCurObj.selApp.itemName = oCurObj.selApp.name;
                    oCurObj.selAppId = oCurObj.appList[i].id;
                    sessionStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
                    fAfterGetList();
                    break;
                } else {
                    notFoundCount++;
                }
            }
            if (oCurObj.appList.length === 0 || notFoundCount === oCurObj.appList.length) {
                oCurObj.router.navigate(["/apps"], { replaceUrl: true });
            }
        };
        this.loadAllApps(fAfterFoundSelApp);
    }
    setAppSelCampGrpToBreadCrumbModel(campGrpSelected, fAfterGetList) {
        let ocurObj = this;
        let campGrpId = decodeURI(campGrpSelected);
        let fAfterFoundSelCapmgSrp = function () {
            let notFoundCount = 0;
            if (ocurObj.campGrpList) {
                for (let i = 0; i < ocurObj.campGrpList.length; i++) {
                    if (ocurObj.campGrpList[i].id === campGrpId) {
                        ocurObj.selCampGrp = ocurObj.campGrpList[i];
                        ocurObj.selCampGrp.itemName = ocurObj.selCampGrp.name;
                        ocurObj.selCampaignGrpId = campGrpId;
                        fAfterGetList();
                        break;
                    } else {
                        notFoundCount++;
                    }
                }
            }
            if (ocurObj.campGrpList.length === 0 || notFoundCount === ocurObj.campGrpList.length) {
                if (ocurObj.selApp) {
                    ocurObj.router.navigate(["/campaign-group/project/" + decodeURI(ocurObj.selApp.id) + '/' + ocurObj.selApp.name], { replaceUrl: true });
                } else if (ocurObj.selAppId) {
                    ocurObj.router.navigate(["/campaign-group/project/" + ocurObj.selAppId], { replaceUrl: true });
                }
            }
        };
        if (this.campGrpList && this.selCampaignGrpId === campGrpId) {
            fAfterFoundSelCapmgSrp();
        } else {
            this.loadSelAppCampGrp(fAfterFoundSelCapmgSrp);
        }
    }
    setBreadCrumbToApp(response) {
        this.appPageType = 'app';
        this.crumbsArray = [{ name: 'Apps', router: '#/apps', brdCrmbId: '1', list: [], selVal: [] }];
    }
    setBreadCrumbToCampGrp(response) {
        this.setBreadCrumbToApp(response);
        if (response.content && response.content.appId) {
            this.selAppId = response.content.appId;
        }
        else if (!this.selApp && this.appList.length) {
            this.selAppId = this.appList[0].id;
        }
        this.setAppSelAppToBreadCrumbModel(response.content.appId, () => {
            this.appPageType = 'app-CG';
            this.crumbsArray.push({
                appPageType: this.appPageType,
                name: 'Campaigns',
                router: '#/campaign-group/project/' + this.selApp.id + '/' + this.selApp.name, brdCrmbId: '2',
                list: this.appList,
                selVal: [this.selApp]
            });
        });
    }
    setBreadCrumbToCampTemp(response) {
        this.selAppId = response.content.appId;
        this.setBreadCrumbToCampGrp(response);
        if (response.content && response.content.campGrpId) {
            this.setAppSelCampGrpToBreadCrumbModel(response.content.campGrpId, () => {
                this.appPageType = 'app-CT';
                this.crumbsArray.push({
                    appPageType: this.appPageType,
                    name: 'Messages',
                    router: '#/campaign-template/group/' + this.selCampGrp.id + '/' + this.selCampGrp.name,
                    brdCrmbId: '2',
                    list: this.campGrpList,
                    selVal: [this.selCampGrp]
                });
            });
        }
    }
    setBreadCrumbToAudSeg(response, bIsselectedFirstApp) {
        let oCurObj = this;
        oCurObj.setBreadCrumbToApp(response);
        if (!oCurObj.selApp || bIsselectedFirstApp) {
            oCurObj.selApp = oCurObj.appList[0];
            sessionStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
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
    }
    setBreadCrumbToInsights(response, bIsselectedFirstApp) {
        let oCurObj = this;
        oCurObj.setBreadCrumbToApp(response);
        if (!oCurObj.selApp || bIsselectedFirstApp) {
            oCurObj.selApp = oCurObj.appList[0];
            sessionStorage['selectedApp'] = JSON.stringify(oCurObj.selApp);
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
    }
    goToLineItemPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.selApp) {
            this.router.navigate(['/linechart/project/' + this.selApp.id], {});
        } else if (this.appList && this.appList.length) {
            sessionStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            this.router.navigate(['/linechart/project/' + this.appList[0].id], {});
        } else {
            sessionStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            oCurObj.router.navigate(['/linechart/project/' + oCurObj.appList[0].id], {});
        }
    }
    goToCampStatPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.appList && this.appList.length) {

            this.router.navigate(['/campaign-stat/'], {});
        } else {
            oCurObj.router.navigate(['/campaign-stat/'], {});
        }
    }
    goToSegAudPage() {
        let oCurObj = this;
        this.collapseNavbar();
        if (this.selApp) {
            this.router.navigate(['/audience-segments/project/' + this.selApp.id], {});
        } else if (this.appList && this.appList.length) {
            sessionStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            this.router.navigate(['/audience-segments/project/' + this.appList[0].id], {});
        } else {
            sessionStorage['selectedApp'] = JSON.stringify(this.appList[0]);
            oCurObj.router.navigate(['/audience-segments/project/' + oCurObj.appList[0].id], {});
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
                this.router.navigate(['/campaign-template/group/' + this.selCampGrp.id + '/' + this.selCampGrp.name], { replaceUrl: true });
                break;
            case 'INS':
                sessionStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.selApp = oSelectedItm;
                this.router.navigate(['/linechart/project/' + this.selApp.id], { replaceUrl: true });
                break;
            case 'app-CG':
                sessionStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.selApp = oSelectedItm;
                this.router.navigate(['/campaign-group/project/' + this.selApp.id + '/' + this.selApp.name], { replaceUrl: true });
                break;
            case 'AS':
                this.selApp = oSelectedItm;
                sessionStorage['selectedApp'] = JSON.stringify(oSelectedItm);
                this.router.navigate(['/audience-segments/project/' + this.selApp.id], { replaceUrl: true });
                break;
        }
    }
    ngOnDestroy() {
    }
}
