import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';

import { ProfileService } from '../profiles/profile.service';
import { Principal, LoginModalService, LoginService, ResponseWrapper } from '../../shared';

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
    appList : any[];
    selApp : any;
    campGrpList: any[];
    crumbsArray: any[];
    eventSubscriber: Subscription;
    appPageType : string;
    selCampGrp : any;

    constructor(
        private loginService: LoginService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private breadCrumbService: BreadCrumbService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private appsService : AppsService,
        private campaignGroupService: CampaignGroupService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }
    loadAllApps(){
        if(!this.appList || this.appList.length === 0){
            this.appsService.query({}).subscribe((res: ResponseWrapper) => this.eventManager.broadcast({ name: 'appListModified', content: res.json}));
        }
    }
    loadSelAppCampGrp(){
        //this.loadAllApps();
        if((!this.campGrpList || this.campGrpList.length === 0) && this.selApp){
            this.campaignGroupService.query({appId:this.selApp.id}).subscribe((res: ResponseWrapper) => this.eventManager.broadcast({ name: 'campaignGroupListModified', content: res.json}));
        }
    }
    ngOnInit() {
        this.loadAllApps();
        this.registerSubscribers();
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }
    registerSubscribers (){
        this.eventSubscriber = this.eventManager.subscribe('appListModified', response => this.setAppDataToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('selectedApp', response => this.setAppSelAppToBreadCrumbModel(response));
        
        this.eventSubscriber = this.eventManager.subscribe('campaignGroupListModified', response => this.setCampGrpDataToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('selectedCampGrp', response => this.setAppSelCampGrpToBreadCrumbModel(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToApp', response => this.setBreadCrumbToApp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampGrp', response => this.setBreadCrumbToCampGrp(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToCampTemp', response => this.setBreadCrumbToCampTemp(response));
        
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToAudSeg', response => this.setBreadCrumbToAudSeg(response));
        this.eventSubscriber = this.eventManager.subscribe('setBreadCrumbToInsights', response => this.setBreadCrumbToInsights(response));
        this.eventSubscriber = this.eventManager.subscribe('clearBdData', response => this.clearBdData(response));
    }
    clearBdData(res){
        this.crumbsArray = [];
    }
    setAppDataToBreadCrumbModel(appListModified){
        this.appList = appListModified.content || [];
        for(var i=0;i<this.appList.length;i++){
            this.appList[i].itemName = this.appList[i].name;
        }
    }
    setAppSelAppToBreadCrumbModel(appSelected){
        let AppId = appSelected.content;
        this.loadAllApps();
        if(this.appList){
            for(var i=0;i<this.appList.length;i++){
                if(this.appList[i].id === AppId){
                    this.selApp = this.appList[i];
                    this.selApp.itemName = this.selApp.name;
                    break;
                }
            }
        }
        else{

        }
    }
    setCampGrpDataToBreadCrumbModel(campGrpListModified){
        this.campGrpList = campGrpListModified.content || [];
        for(var i=0;i<this.campGrpList.length;i++){
            this.campGrpList[i].itemName = this.campGrpList[i].name;
        }
        this.eventManager.broadcast({ name: 'campGrpDataReady', content: 'OK'});
    }
    setAppSelCampGrpToBreadCrumbModel(campGrpSelected){
        let campGrpId = campGrpSelected.content;
        this.loadSelAppCampGrp();
        if(this.campGrpList){
            for(var i=0;i<this.campGrpList.length;i++){
                if(this.campGrpList[i].id === campGrpId){
                    this.selCampGrp = this.campGrpList[i];
                    this.selCampGrp.itemName = this.selCampGrp.name;
                    this.eventManager.broadcast({ name: 'campaignGroupDataReady', content: 'OK'});
                    //this.eventManager.broadcast({ name: 'setBreadCrumbToCampGrp', content: 'OK'});
                    break;
                }
            }
        }
        else{

        }
    }
    setBreadCrumbToApp(response){
        this.appPageType = 'app';
        this.crumbsArray = [{ name: 'Apps', router: '#/apps', brdCrmbId: '1', list:[], selVal : []}];
    }
    setBreadCrumbToCampGrp(response){
        this.setBreadCrumbToApp(response);
        if(this.appList && this.appList.length){
            if(!this.selApp){
                this.selApp = this.appList[0];
            }
            this.appPageType = 'app-CG';
            this.crumbsArray.push({appPageType:this.appPageType, name: 'Campaigns', router: '#/campaign-group/project/' + this.selApp.id + "/" + this.selApp.name , brdCrmbId: '2', list:this.appList, selVal : [this.selApp]});
        }
    }
    setBreadCrumbToCampTemp(response){
        this.setBreadCrumbToCampGrp(response);
        if(this.campGrpList && this.campGrpList.length){
            if(response.content.campGrpId && !this.selCampGrp){
                this.eventManager.broadcast({ name: 'selectedCampGrp', content: response.content.campGrpId});
            }
            this.appPageType = 'app-CT';
            this.crumbsArray.push({appPageType:this.appPageType, name: 'Messages', router: '#/campaign-template/group/' + this.selCampGrp.id + "/" + this.selCampGrp.name , brdCrmbId: '2', list:this.campGrpList, selVal : [this.selCampGrp]});
        }
    }
    setBreadCrumbToAudSeg(response){
        this.loadAllApps();
        this.setBreadCrumbToApp(response);
        if(!this.selApp){
            this.selApp = this.appList[0];
        }
        if(this.appList && this.appList.length){
            this.appPageType = 'AS';
            this.crumbsArray.push({appPageType:this.appPageType, name: 'Audience Segments', router: '#/audience-segments;page=0;sort=id,asc;segName=' + this.selApp.name, brdCrmbId: '2', list:this.appList, selVal: [this.selApp]});
        }
    }
    setBreadCrumbToInsights(response){
        this.loadAllApps();
        this.setBreadCrumbToApp(response);
        if(!this.selApp){
            this.selApp = this.appList[0];
        }
        this.appPageType = 'INS';
        this.crumbsArray.push({appPageType:this.appPageType, name: 'Insights', router: '#/linechart;segName=' + this.selApp.name, brdCrmbId: '2', list:this.appList, selVal: [this.selApp]});
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
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
    onItemSelect(oSelectedItm, appPageType){
        switch(appPageType){
            case 'app-CT':
                this.selCampGrp = oSelectedItm;
                this.router.navigate(['/campaign-template/group/' + this.selCampGrp.id + "/" + this.selCampGrp.name], {});
            break;
            case 'INS':
                this.selApp = oSelectedItm;
            break;
            case 'app-CG':
                this.selApp = oSelectedItm;
                this.router.navigate(['/campaign-group/project/' + this.selApp.id + '/' + this.selApp.name], {});
            break;
            case 'AS':
                this.selApp = oSelectedItm;
                this.router.navigate(['/audience-segments/' + this.selApp.id], {});
            break;
        }
    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}
