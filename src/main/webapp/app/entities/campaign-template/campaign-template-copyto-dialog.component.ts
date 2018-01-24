import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';

import { CampaignTemplate } from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseWrapper } from '../../shared';
import { CampaignGroupService } from '../campaign-group/campaign-group.service';

import {
    CampaignTemplateFilterCriterion, RecurrenceType, FilterOption, CampaignTargetGroupSizeRequest,
    TargetGroupFilterCriterionSizeRequest
} from './campaign-template.model';

@Component({
    selector: 'jhi-campaign-template-copyto-dialog',
    templateUrl: './campaign-template-copyto-dialog.component.html'
})
export class CampaignTemplateCopyToDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    appList: any[];
    camGrpList: any[];
    selectedApp: any[];
    selectedCampGrp: any[];

    constructor(
        private campaignTemplateService: CampaignTemplateService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private http: HttpClient,
        private alertService: JhiAlertService,
        private campaignGroupService: CampaignGroupService
    ) {
        this.selectedApp = [];
        this.appList = [];
        this.camGrpList = [];
        this.selectedCampGrp = [];
    }

    ngOnInit() {
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
            if (sessionStorage['appList']) {
                const appList = JSON.parse(sessionStorage['appList']);
                let relatedAppList = [];
                if(this.campaignTemplate.retargetedCampaign){
                    this.appList = [JSON.parse(sessionStorage['selectedApp'])];
                    this.selectedApp = this.appList;
                    this.getCampaignGrpsForSelApp(this.selectedApp[0]);
                } else{
                    for(var i=0;i<appList.length;i++){
                        if(appList[i].product === this.campaignTemplate.product){
                            relatedAppList.push(appList[i]);
                        }
                    }
                    this.appList = relatedAppList;
                }
                
            } else {
                this.clear();
            }
        });
        console.log(this.campaignTemplate);
    }
    onItemSelect(itm) {
        this.selectedApp = [itm];
        document.getElementById("copyToAppMultiSelect").click();
        this.getCampaignGrpsForSelApp(itm);
    }
    onItemDeSelect(itm) {
        this.selectedApp = [itm];
        document.getElementById("copyToAppMultiSelect").click();
    }
    onCampGrpItemSelect(itm) {
        this.selectedCampGrp = [itm];
        document.getElementById("copyToCampMultiSelect").click();
    }
    onCampGrpItemDeSelect(itm) {
        this.selectedCampGrp = [itm];
        document.getElementById("copyToCampMultiSelect").click();
    }
    getCampaignGrpsForSelApp(itm) {
        this.selectedCampGrp = [];
        if (this.selectedApp && this.selectedApp.length) {
            this.campaignGroupService.queryAll({ appId: this.selectedApp[0].id }).subscribe(
                (res: ResponseWrapper) => this.setCapgrpData(res.json),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        }
    }
    setCapgrpData(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].itemName = data[i].name;
        }
        this.camGrpList = data;
    }
    confirm() {
        this.campaignTemplateService.search({ campGroupId: this.selectedCampGrp[0].id, searchVal: this.campaignTemplate.campaignName }, {}).subscribe(
            (res: ResponseWrapper) => this.copyCurrentIrmWithCopyCountToSelCampGrp(res.json),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    copyCurrentIrmWithCopyCountToSelCampGrp(acampaigns) {
        let count = 0;
        let copOrRetagTxt = '(Copy ';
        let copyRertaEndSplitTxt = ')';
        // if (acampaigns.length === 1) {
        //     this.campaignTemplate.campaignGroupId = this.selectedCampGrp[0].id;
        //     this.campaignTemplateService.copyorRetargetCampaignTemplate(this.campaignTemplate, 0, false).subscribe(
        //         (res: ResponseWrapper) => this.onSaveSuccess(),
        //         (res: Response) => this.OnSaveError(res)
        //     );
        // } else {
            let copyCountArr = [];
            for (var i = 0; i < acampaigns.length; i++) {
                if (acampaigns[i].campaignName.indexOf(copOrRetagTxt) > -1) {
                    let aSubName = acampaigns[i].campaignName.split(copOrRetagTxt);
                    if (aSubName.length) {
                        aSubName.splice(0, 1);
                        aSubName = aSubName.join(copOrRetagTxt);
                        if (aSubName.indexOf(copyRertaEndSplitTxt) > -1) {
                            let aActualCapName = aSubName.split(copyRertaEndSplitTxt);
                            const copyCountNo = aActualCapName.splice(0, 1);
                            aActualCapName = aActualCapName.join(copyRertaEndSplitTxt);
                            if (aActualCapName === this.campaignTemplate.campaignName) {
                                count++;
                                if (copyCountNo[0] && !isNaN(copyCountNo[0])) {
                                    copyCountArr.push(parseInt(copyCountNo[0] || 0));
                                }
                            }
                        }
                    }
                }
            }
            copyCountArr.sort();
            if (count > 0) {
                count = (copyCountArr[copyCountArr.length - 1] || 0) + 1;
            }
            this.campaignTemplate.campaignGroupId = this.selectedCampGrp[0].id;
            this.campaignTemplateService.copyorRetargetCampaignTemplate(this.campaignTemplate, count, false).subscribe(
                (res: ResponseWrapper) => this.onSaveSuccess(),
                (res: Response) => this.OnSaveError(res)
            );
       // }
    }
    clear() {
        this.activeModal.dismiss('cancel');
    }
    private onSaveSuccess() {
        if(this.campaignTemplate.campaignGroupId === this.selectedCampGrp[0].id){
            this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
        }
        this.activeModal.dismiss();
    }
    private OnSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-campaign-template-copyto-popup',
    template: ''
})
export class CampaignTemplateCopyToPopupComponent implements OnInit {

    routeSub: any;
    appRouteId: any;

    constructor(
        private route: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            this.appRouteId = data['pagingParams'].appId;
            if (this.appRouteId) {
                this.campaignTemplatePopupService.open(CampaignTemplateCopyToDialogComponent as Component, this.appRouteId);
            }
        });
    }
}
