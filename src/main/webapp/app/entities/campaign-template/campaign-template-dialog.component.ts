import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ResponseWrapper, LANGUAGES, TIME_ZONES } from '../../shared';
import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Location } from '@angular/common';
import {
    CampaignTemplate, CampaignTemplateFilterCriterion, CampaignTemplateContentCriterion, CampaignTemplateMetaDataCriterion, RecurrenceType, FilterOption, CampaignTargetGroupSizeRequest,
    TargetGroupFilterCriterionSizeRequest
} from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { setTimeout } from 'timers';

@Component({
    selector: 'jhi-campaign-template-dialog',
    templateUrl: './campaign-template-dialog.component.html'
})
export class CampaignTemplateDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    isSaving: boolean;
    showSendImmDiv: boolean;
    startDateDp: any;
    recurrenceEndDateDp: any;
    campaignTemplateGroupCreationForm: FormGroup;
    filterOptions: string[];
    filtersMap: Map<string, Map<string, string[]>>;
    appVersionMap: Map<string, string[]>;
    sportsEventsMap: Map<string, Map<string, string>>;
    pokerEventsMap: Map<string, Map<string, string>>;
    casinoEventsMap: Map<string, Map<string, string>>;
    minDate: NgbDateStruct;
    sportsTagsMap: Map<string, Map<string, string[]>>;
    pokerTagsMap: Map<string, Map<string, string[]>>;
    casinoTagsMap: Map<string, Map<string, string[]>>;

    countries: any[];
    languages: any[];
    languagesList: string[];
    targetGroupSize: number;
    targetContentGroupSize: number[];
    time: SimpleTime;
    ctrl: any;
    operatingSystems: string[] = ['android', 'ios'];
    isLaunch: boolean;
    timerValidation: boolean = false;
    currentDate: Date = new Date();
    isRecuEndDateVisible: boolean;
    currentContentGrp: number;
    segmentNames: string[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignTemplateService: CampaignTemplateService,
        private eventManager: JhiEventManager,
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private location: Location,

    ) {
        this.filtersMap = new Map<string, Map<string, string[]>>();
        this.sportsEventsMap = new Map<string, Map<string, string>>();
        this.pokerEventsMap = new Map<string, Map<string, string>>();
        this.casinoEventsMap = new Map<string, Map<string, string>>();

        this.sportsTagsMap = new Map<string, Map<string, string[]>>();
        this.pokerTagsMap = new Map<string, Map<string, string[]>>();
        this.casinoTagsMap = new Map<string, Map<string, string[]>>();
        this.appVersionMap = new Map<string, string[]>();
        this.countries = [];
        this.languages = [];
        this.targetGroupSize = 0;
        this.targetContentGroupSize = [0];
        this.campaignTemplateGroupCreationForm = this.fb.group({
            targetGroupFilterCriteria: this.fb.array([]),
            targetGroupContentCriteria: this.fb.array([]),
            targetGroupMetaData: this.fb.array([]),
            campaignName: ['', Validators.required]
        });
        this.isLaunch = false;
    }

    ngOnInit() {
        this.isSaving = false;
        this.showSendImmDiv = true;
        // this.campaignTemplateService.getOptimoveInstances().subscribe((data) => {
        //     this.campaignTemplate.optimoveInstances = data['message'];
        // });
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
        });
        const body = {
            'frontEnd': this.campaignTemplate.frontEnd,
            'product': this.campaignTemplate.product
        }
        this.campaignTemplateService.getSegments(body).subscribe(
            (res: ResponseWrapper) => {
                this.segmentNames = res['segments'];
                this.populateSegmentParams();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.createForm();
        this.prepareData();
        this.populateCountries();
        this.populateLanguages();
        this.populateFilterOptions();
        this.populateEventsMaps();
        this.populateTagsMaps();
        this.populateFiltersMap();
        this.populateLanguagesList();

        const now = new Date();
        this.minDate = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate()
        };
        // this.ctrl = new FormControl('', (control: FormControl) => {
        //     const value = control.value;

        //     if (!value) {
        //         return null;
        //     }

        //     if (value.hour < 12) {
        //         return { tooEarly: true };
        //     }
        //     if (value.hour > 13) {
        //         return { tooLate: true };
        //     }

        //     return null;
        //   });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        const cuurentDateObj = new Date();
        if (this.campaignTemplateGroupCreationForm.value.sendImmediately || (!this.campaignTemplateGroupCreationForm.value.sendImmediately && this.checkCurrentTime())) {
            this.isSaving = true;
            const currentHourValue = cuurentDateObj.getUTCHours();
            const currentMinValue = cuurentDateObj.getUTCMinutes();
            if (this.campaignTemplateGroupCreationForm.value.time) {
                this.campaignTemplateGroupCreationForm.value.scheduledTime = '' +
                    (this.campaignTemplateGroupCreationForm.value.time.hour < 10 ? '0' +
                        this.campaignTemplateGroupCreationForm.value.time.hour : this.campaignTemplateGroupCreationForm.value.time.hour) + ':' +
                    (this.campaignTemplateGroupCreationForm.value.time.minute < 10 ? '0' +
                        this.campaignTemplateGroupCreationForm.value.time.minute : this.campaignTemplateGroupCreationForm.value.time.minute) + ':00';

            } else {
                this.campaignTemplateGroupCreationForm.value.scheduledTime = '' + (currentHourValue < 10 ? '0' + currentHourValue : currentHourValue) + ':' + (currentMinValue < 10 ? '0' + currentMinValue : currentMinValue) + ':00';
            }
            if (this.campaignTemplateGroupCreationForm.value.sendImmediately) {
                this.campaignTemplateGroupCreationForm.value.scheduledTime = '' + (currentHourValue < 10 ? '0' + currentHourValue : currentHourValue) + ':' + (currentMinValue < 10 ? '0' + currentMinValue : currentMinValue) + ':00';
            }
            if (this.campaignTemplateGroupCreationForm.value.recurrenceType === 'NONE') {
                this.campaignTemplateGroupCreationForm.value.recurrenceEndDate = this.campaignTemplateGroupCreationForm.value.startDate;
            }

            if (this.campaignTemplateGroupCreationForm.value.id !== null) {
                this.subscribeToSaveResponse(
                    this.campaignTemplateService.update(this.campaignTemplateGroupCreationForm.value));
            } else {
                this.subscribeToSaveResponse(
                    this.campaignTemplateService.create(this.campaignTemplateGroupCreationForm.value));
            }
        } else {
            this.timerValidation = this.campaignTemplate.sendImmediately ? true : false;
            this.addTimeControl();
        }

    }
    checkCurrentTime() {
        const cuurentDateObj = new Date();
        const startDt = this.campaignTemplateGroupCreationForm.value.startDate;
        if (startDt.year === cuurentDateObj.getUTCFullYear() && startDt.month === cuurentDateObj.getUTCMonth() + 1 && startDt.day === cuurentDateObj.getUTCDate()) {
            const totalCurrentDayMinutes = cuurentDateObj.getUTCHours() * 60 + cuurentDateObj.getUTCMinutes();
            if (((this.campaignTemplateGroupCreationForm.value.time.hour * 60) + this.campaignTemplateGroupCreationForm.value.time.minute) < totalCurrentDayMinutes) {
                return false;
            } else {
                return true;
            }
        }
        else {
            return true;
        }
    }

    prepareSaveTargetGroupCriteria(): CampaignTemplate {
        const formModel = this.campaignTemplateGroupCreationForm.value;

        // deep copy of form model lairs
        const targetGroupFilterCriteriaDeepCopy: CampaignTemplateFilterCriterion[] = formModel.targetGroupFilterCriteria.map(
            (targetGroupFilterCriterion: CampaignTemplateFilterCriterion) => Object.assign({}, targetGroupFilterCriterion)
        );

        // return new `TargetGroupCriteria` object containing a combination of original targetGroupCriteria value(s)
        // and deep copies of changed form model values
        const saveTargetGroupCriteria: CampaignTemplate = {
            id: this.campaignTemplate.id,
            name: formModel.name as string,
            frontEnd: formModel.frontEnd as string,
            product: formModel.product as string,
            // targetGroupFilterCriteria: formModel.targetGroupFilterCriteria // <-- bad!
            targetGroupFilterCriteria: targetGroupFilterCriteriaDeepCopy
        };
        return saveTargetGroupCriteria;
    }

    addCampaignTemplateFilterCriterion() {
        this.targetGroupFilterCriteria.push(this.fb.group(new CampaignTemplateFilterCriterion('', '', '', [], {}, [])));
    }

    addCampaignTemplateContentCriterion() {
        this.targetGroupContentCriteria.push(this.fb.group(new CampaignTemplateContentCriterion('', '', '')));
    }

    addCampaignTemplateMetaDataCriterion() {
        //this.targetGroupMetaData.push(this.fb.group(new CampaignTemplateMetaDataCriterion('', '')));

        this.targetGroupMetaData.push(this.fb.group({
            key: ["", this.liveOddKeyUniqueCheck()],
            value: ['', Validators.required]
        }));
    }

    createForm() {
        if (!this.campaignTemplate) {
            this.campaignTemplate = new CampaignTemplate();
        }
        const now = new Date();
        now.setUTCDate(now.getUTCDate() + 1);
        const todayDt = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate()
        };
        this.timerValidation = this.campaignTemplate.scheduledTime ? true : false;
        this.campaignTemplateGroupCreationForm = this.fb.group({
            id: (!this.campaignTemplate.id) ? null : this.campaignTemplate.id,
            frontEnd: (!this.campaignTemplate.frontEnd) ? '' : this.campaignTemplate.frontEnd,
            product: (!this.campaignTemplate.product) ? '' : this.campaignTemplate.product,
            campaignName: (!this.campaignTemplate.campaignName) ? '' : this.campaignTemplate.campaignName,
            status: (!this.campaignTemplate.status) ? 'Draft' : this.campaignTemplate.status,
           // campaignDescription: (!this.campaignTemplate.campaignDescription) ? '' : this.campaignTemplate.campaignDescription,
            startDate: (!this.campaignTemplate.startDate) ? todayDt : this.campaignTemplate.startDate,
            sendImmediately: (!this.campaignTemplate.sendImmediately) ? false : this.campaignTemplate.sendImmediately,
            recurrenceType: (!this.campaignTemplate.recurrenceType) ? 'NONE' : this.campaignTemplate.recurrenceType,
            recurrenceEndDate: (!this.campaignTemplate.recurrenceEndDate) ? todayDt : this.campaignTemplate.recurrenceEndDate,
            scheduledTime: (!this.campaignTemplate.scheduledTime) ? '' : this.campaignTemplate.scheduledTime,
            inPlayerTimezone: (!this.campaignTemplate.inPlayerTimezone) ? false : this.campaignTemplate.inPlayerTimezone,
            campaignGroupId: (!this.campaignTemplate.campaignGroupId) ? '' : this.campaignTemplate.campaignGroupId,
            // contentName: (!this.campaignTemplate.contentName) ? '' : this.campaignTemplate.contentName,
            contentTitle: (!this.campaignTemplate.contentTitle) ? '' : this.campaignTemplate.contentTitle,
            contentBody: (!this.campaignTemplate.contentBody) ? '' : this.campaignTemplate.contentBody,
            metaData: (!this.campaignTemplate.metaData) ? '' : this.campaignTemplate.metaData,
            targetGroupFilterCriteria: this.fb.array([]),
            targetGroupContentCriteria: this.fb.array([]),
            targetGroupMetaData: this.fb.array([]),
            editEnabled: (this.campaignTemplate && !this.campaignTemplate.editEnabled ? false : true),
            launchEnabled: (this.campaignTemplate && !this.campaignTemplate.launchEnabled ? false : true),
            // time: this.fb.control((!this.campaignTemplate.scheduledTime) ? new SimpleTime(this.currentDate.getUTCHours(), this.currentDate.getUTCMinutes()) :
            //     new SimpleTime(Number(this.campaignTemplate.scheduledTime.substr(0, 2)),
            //         Number(this.campaignTemplate.scheduledTime.substr(3, 2))), (control: FormControl) => {
            //             if(this.timerValidation){
            //                 return null;
            //             }
            //             else{
            //                 const value = control.value;
            //                 const totalCurrentDayMinutes = this.currentDate.getUTCHours() * 60 + this.currentDate.getUTCMinutes();
            //                 const minutes = this.currentDate.getUTCMinutes();
            //                 if (!value) {
            //                     return null;
            //                 }
            //                 if (((value.hour * 60) + value.minute) < totalCurrentDayMinutes) {
            //                     return { invalid: true };
            //                 }
            //                 return null;
            //             }
            //         }),
            languageSelected: (!this.campaignTemplate.languageSelected) ? '' : this.campaignTemplate.languageSelected,
            optimoveInstances: (!this.campaignTemplate.optimoveInstances) ? '' : this.campaignTemplate.optimoveInstances,
            pushToOptimoveInstances: (!this.campaignTemplate.pushToOptimoveInstances) ? false : this.campaignTemplate.pushToOptimoveInstances,
        });

        this.addTimeControl();
        // (<FormControl>this.campaignTemplateGroupCreationForm.controls['recurrenceType']).setValue('NONE');
    }
    get targetGroupFilterCriteria(): FormArray {
        return this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
    };

    get targetGroupContentCriteria(): FormArray {
        return this.campaignTemplateGroupCreationForm.get('targetGroupContentCriteria') as FormArray;
    };

    get targetGroupMetaData(): FormArray {
        return (this.campaignTemplateGroupCreationForm.get('targetGroupMetaData') || []) as FormArray;
    };

    onStartDtChange() {
        var _this = this;
        if (!this.campaignTemplateGroupCreationForm.value.sendImmediately) {
            setTimeout(function () {
                _this.addTimeControl();
            }, 0);
        }
    }
    addTimeControl() {
        const cuurentDateObj = new Date();
        this.campaignTemplateGroupCreationForm.addControl('time', new FormControl(
            (!this.timerValidation) ? new SimpleTime(this.currentDate.getUTCHours(), this.currentDate.getUTCMinutes()) :
                new SimpleTime(Number(this.campaignTemplate.scheduledTime.substr(0, 2)),
                    Number(this.campaignTemplate.scheduledTime.substr(3, 2))),
            (control: FormControl) => {
                // debugger;
                if (this.timerValidation) {
                    return null;
                }
                const startDt = this.campaignTemplateGroupCreationForm.value.startDate;
                if (startDt.year === cuurentDateObj.getUTCFullYear() && startDt.month === cuurentDateObj.getUTCMonth() + 1 && startDt.day === cuurentDateObj.getUTCDate()) {
                    const value = control.value;
                    const cuurentDateObj = new Date();
                    const totalCurrentDayMinutes = cuurentDateObj.getUTCHours() * 60 + cuurentDateObj.getUTCMinutes();
                    const minutes = this.currentDate.getUTCMinutes();
                    if (!value) {
                        return null;
                    }
                    if (((value.hour * 60) + value.minute) < totalCurrentDayMinutes) {
                        return { invalid: true };
                    }
                }
                return null;
            }));
    }
    removeTimeControl() {
        this.campaignTemplateGroupCreationForm.removeControl('time');
    }
    prepareData() {
        if (this.campaignTemplate.targetGroupFilterCriteria) {
            for (const i of this.campaignTemplate.targetGroupFilterCriteria) {
                if (Array.isArray(i.filterOptionValue)) {
                    let simpDt, fileOptArray = [];
                    if (i.filterOptionValue[0].indexOf("-") > -1) {
                        const simpDtarray = i.filterOptionValue[0].split('-');
                        if (simpDtarray.length === 3) {
                            simpDt = {
                                year: parseInt(simpDtarray[0]),
                                month: parseInt(simpDtarray[1]),
                                day: parseInt(simpDtarray[2])
                            }
                        }
                    }
                    if(i.filterOption === 'Country' || i.filterOption === 'Language'){
                        for(var j=0;j<i.filterOptionValue.length;j++)
                        fileOptArray.push({id:i.filterOptionValue[j], itemName:i.filterOptionValue[j]});
                    }
                    const formBuilderGroup = this.fb.group({
                        filterOption: i.filterOption,
                        filterOptionComparison: i.filterOptionComparison,
                        filterOptionLookUp: i.filterOptionLookUp,
                        filterOptionValue: [i.filterOptionValue],
                        simpleDate: simpDt,
                        selectedItems : [fileOptArray]
                    });
                    this.targetGroupFilterCriteria.push(formBuilderGroup);
                } else {
                    this.targetGroupFilterCriteria.push(this.fb.group(i));
                }
            }
        }
        if (this.campaignTemplate.targetGroupContentCriteria && this.campaignTemplate.targetGroupContentCriteria.length) {
            for (const i of this.campaignTemplate.targetGroupContentCriteria) {
                this.targetGroupContentCriteria.push(this.fb.group(i));
            }
        } else {
            this.targetGroupContentCriteria.push(this.fb.group({
                //contentName: '',
                contentTitle: '',
                contentBody: '',
                languageSelected: ''
            }));
        }
        if (this.campaignTemplate.targetGroupMetaData) {
            for (const i of this.campaignTemplate.targetGroupMetaData) {
                this.targetGroupMetaData.push(this.fb.group(i));
            }
        }
    }
    populateLanguagesList() {
        this.languagesList = LANGUAGES;
    }
    sendImmediatelyCheck() {
        const now = new Date();
        const todayDt1 = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate()
        };
        const cuurentDateObj = new Date();
        cuurentDateObj.setUTCDate(cuurentDateObj.getUTCDate() + 1);
        const todayDt2 = {
            year: cuurentDateObj.getUTCFullYear(),
            month: cuurentDateObj.getUTCMonth() + 1,
            day: cuurentDateObj.getUTCDate()
        };
        this.timerValidation = this.campaignTemplateGroupCreationForm.controls['sendImmediately'].value;
        if (this.timerValidation) {
            this.removeTimeControl();
            this.campaignTemplateGroupCreationForm.controls['startDate'].setValue(todayDt1);
            this.campaignTemplateGroupCreationForm.controls['recurrenceType'].setValue('NONE');
            this.campaignTemplateGroupCreationForm.controls['recurrenceEndDate'].setValue(todayDt1);
        } else {
            this.currentDate = new Date();
            this.addTimeControl();
            this.showSendImmDiv = true;
            this.campaignTemplateGroupCreationForm.controls['startDate'].setValue(todayDt2);
            this.campaignTemplateGroupCreationForm.controls['recurrenceType'].setValue('NONE');
            this.campaignTemplateGroupCreationForm.controls['recurrenceEndDate'].setValue(todayDt2);
        }
        // debugger;
    }

    onRecurrenceType() {
        const recurrenceType = this.campaignTemplateGroupCreationForm.controls['recurrenceType'].value;
        switch (recurrenceType) {
            case 'NONE':
                this.isRecuEndDateVisible = false;
                break;
            default:
                this.isRecuEndDateVisible = true;
                break;
        }
    }

    // pushOptimoveInstances() {
    //     if (this.campaignTemplate.id) {
    //         const body = {
    //             'templateId': this.campaignTemplate.id,
    //             'optimoveInstances': this.campaignTemplateGroupCreationForm.controls['optimoveInstances'].value
    //         }

    //         this.campaignTemplateService.pushOptimoveInstances(body).subscribe(
    //             (res: ResponseWrapper) => {
    //                 alert(res);
    //             },
    //             (res: ResponseWrapper) => this.onError(res.json)
    //         );
    //     } else {
    //         console.log('templateId is null..');
    //     }
    // }

    getTargetGroupSize() {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        let formLengthIterator = 0;
        const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        while (formLengthIterator < targetGroupFilters.length) {
            const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
            const optionValues: string[] = [];
            if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
                for (const optionValue of targetGroupFilter.get('filterOptionValue').value) {
                    optionValues.push((optionValue || '').toString());
                }
            } else {
                optionValues.push((targetGroupFilter.get('filterOptionValue').value || '').toString());
            }
            targetGroupFilterCriteria.push(new TargetGroupFilterCriterionSizeRequest(targetGroupFilter.get('filterOption').value,
                targetGroupFilter.get('filterOptionLookUp').value,
                targetGroupFilter.get('filterOptionComparison').value,
                optionValues));
            formLengthIterator = formLengthIterator + 1;
        }
        const languagesUpdated: string[] = [];
        let i;
        for (i = 0; i < this.campaignTemplateGroupCreationForm.value.targetGroupContentCriteria.length; i++) {
            languagesUpdated.push(this.campaignTemplateGroupCreationForm.value.targetGroupContentCriteria[i].languageSelected);
        }
        const body = new CampaignTargetGroupSizeRequest(
            this.campaignTemplateGroupCreationForm.get('frontEnd').value,
            this.campaignTemplateGroupCreationForm.get('product').value,
            languagesUpdated,
            targetGroupFilterCriteria);

        this.campaignTemplateService.getTargetGroupSize(body).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupSizeRequestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    getTargetGroupRefreshBtnEnabled() {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        let formLengthIterator = 0;
        const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        while (formLengthIterator < targetGroupFilters.length) {
            const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
            const optionValues: string[] = [];
            if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
                for (const optionValue of targetGroupFilter.get('filterOptionValue').value) {
                    optionValues.push((optionValue || '').toString());
                }
            } else {
                optionValues.push((targetGroupFilter.get('filterOptionValue').value || '').toString());
            }
            const optValCase = this.getFormControlType(formLengthIterator);
            const bOptValReq = optValCase !== null && (!optionValues.length || optionValues.length && optionValues[0]) === '' ? false : true;
            if (!targetGroupFilter.get('filterOption').value || (!this.isOptionLookUpHidden(formLengthIterator) && !targetGroupFilter.get('filterOptionLookUp').value) || !targetGroupFilter.get('filterOptionComparison').value || !bOptValReq) {
                return true;
            }
            formLengthIterator = formLengthIterator + 1;
        }
        return false;
    }
    getTargetContentGroupRefreshBtnEnabled(i) {
        if (this.campaignTemplateGroupCreationForm.value.targetGroupContentCriteria.length === 1) {
            return false;
        }
        return this.campaignTemplateGroupCreationForm.value.targetGroupContentCriteria[i].languageSelected ? false : true;
    }
    getTargetContentGroupSize(i) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        let formLengthIterator = 0;
        const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        while (formLengthIterator < targetGroupFilters.length) {
            const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
            const optionValues: string[] = [];
            if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
                for (const optionValue of targetGroupFilter.get('filterOptionValue').value) {
                    optionValues.push((optionValue || '').toString());
                }
            } else {
                optionValues.push((targetGroupFilter.get('filterOptionValue').value || '').toString());
            }
            targetGroupFilterCriteria.push(new TargetGroupFilterCriterionSizeRequest(targetGroupFilter.get('filterOption').value,
                targetGroupFilter.get('filterOptionLookUp').value,
                targetGroupFilter.get('filterOptionComparison').value,
                optionValues));
            formLengthIterator = formLengthIterator + 1;
        }
        const body = {
            'frontEnd': this.campaignTemplateGroupCreationForm.get('frontEnd').value,
            'product': this.campaignTemplateGroupCreationForm.get('product').value,
            'language': this.campaignTemplateGroupCreationForm.value.targetGroupContentCriteria[i].languageSelected,
            'targetGroupFilterCriteria': targetGroupFilterCriteria
        }
        this.currentContentGrp = i;
        this.campaignTemplateService.getTargetContentGroupSize(body).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupContentSizeRequestSuccess(res, res, this.currentContentGrp),
            (res: ResponseWrapper) => this.onError(res.json)
        );

    }
    onSimpleDateChange(index) {
        var _this = this;//Donot remove time out. change event is not giving changed value imediatly.
        setTimeout(function () {
            const targetGroupFilters = _this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
            const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
            const simpDt = _this.campaignTemplateGroupCreationForm.value.targetGroupFilterCriteria[index].simpleDate;
            if (simpDt && simpDt.year) {
                targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue(simpDt.year + "-" + (parseInt(simpDt.month) < 10 ? '0' + simpDt.month : simpDt.month) + "-" + (parseInt(simpDt.day) < 10 ? '0' + simpDt.day : simpDt.day));
            }
        }, 0);
    }
    onItemSelect(index){
       // console.log(this.selectedItems);
       const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
       const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
       let aSelecteCnt = this.campaignTemplateGroupCreationForm.value.targetGroupFilterCriteria[index].selectedItems;
       let aCntArray = [];
       for(var i=0;i<aSelecteCnt.length;i++){
            aCntArray.push(aSelecteCnt[i].id);
       }
       if(aCntArray.length){
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue(aCntArray);
       }
       else{
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
       }
    }
    liveOddKeyUniqueCheck() {
        var _this = this;
        return (c: AbstractControl): { [key: string]: any } => {
            let isValid = true;
            for (let i = 0; i < _this.campaignTemplateGroupCreationForm.value.targetGroupMetaData.length; i++) {
                if (_this.campaignTemplateGroupCreationForm.value.targetGroupMetaData[i].key === c.value) {
                    isValid = false;
                }
            }
            if (isValid)
                return null;
            else
                return { invalid: true };
        }
    }

    private onTargetGroupContentSizeRequestSuccess(data, headers, contentGrpNo) {
        // console.log(data);
        if (data) {
            this.targetContentGroupSize[contentGrpNo] = data.targetGroupSize;
        } else {
            this.targetContentGroupSize[contentGrpNo] = 0;
        }
    }
    private onTargetGroupSizeRequestSuccess(data, headers) {
        // console.log(data);
        if (data) {
            this.targetGroupSize = data.targetGroupSize;
        } else {
            this.targetGroupSize = 0;
        }
    }

    removeTargetGroupFilterCriterion(i) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        targetGroupFilters.removeAt(i);
    }
    removeTargetGroupContentCriterion(i) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupContentCriteria') as FormArray;
        targetGroupFilters.removeAt(i);
    }
    removeTargetGroupMetaDataCriterion(i) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupMetaData') as FormArray;
        targetGroupFilters.removeAt(i);
    }
    onFilterOptionChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionLookUp').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionComparison').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
        targetGroupFilterCriterionFormControl.get('simpleDate').setValue(null);
        targetGroupFilterCriterionFormControl.get('selectedItems').setValue([]);
    }
    onFilterOptionLookupChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionComparison').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
        targetGroupFilterCriterionFormControl.get('simpleDate').setValue(null);
        targetGroupFilterCriterionFormControl.get('selectedItems').setValue([]);
    }
    onFilterOptionComparisonChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
        targetGroupFilterCriterionFormControl.get('simpleDate').setValue(null);
        targetGroupFilterCriterionFormControl.get('selectedItems').setValue([]);
    }
    getSelectedFilterOptionValueValues(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        return targetGroupFilterCriterionFormControl.get('filterOptionValue').value;
    }
    populateFilterOptions() {
        this.filterOptions = ['App', 'App Version', 'Country', 'Event', 'Install Date', 'Language', 'Last Open Date', 'OS', 'Segment', 'Sessions', 'Tag', 'Timezone'];
        this.filterOptions.sort();
    }
    populateEventsMaps() {
        this.populateSportsEventsMap();
        this.populateCasinoEventsMap();
        this.populatePokerEventsMap();
    }
    populateSportsEventsMap() {
        const filterOptionLookUpVsComparison: Map<string, string> = new Map<string, string>();
        filterOptionLookUpVsComparison.set('did occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur', 'true');
        filterOptionLookUpVsComparison.set('did not occur', 'true');
        filterOptionLookUpVsComparison.set('before', 'date');
        filterOptionLookUpVsComparison.set('after', 'date');
        this.sportsEventsMap.set('bet confirmation', filterOptionLookUpVsComparison);
        this.sportsEventsMap.set('bet slip', filterOptionLookUpVsComparison);
        this.sportsEventsMap.set('browse', filterOptionLookUpVsComparison);
        this.sportsEventsMap.set('deposit', filterOptionLookUpVsComparison);
        this.sportsEventsMap.set('registration', filterOptionLookUpVsComparison);
    }

    populateCasinoEventsMap() {
        const filterOptionLookUpVsComparison: Map<string, string> = new Map<string, string>();
        filterOptionLookUpVsComparison.set('did occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur', 'true');
        filterOptionLookUpVsComparison.set('did not occur', 'true');
        filterOptionLookUpVsComparison.set('before', 'date');
        filterOptionLookUpVsComparison.set('after', 'date');
        this.casinoEventsMap.set('browse', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('firstLoginAfterRegistration', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('openedGame', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('registration', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('teaserEvent', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('crossSellPressed', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('deposit', filterOptionLookUpVsComparison);
        this.casinoEventsMap.set('menuItemPressed', filterOptionLookUpVsComparison);
    }

    populatePokerEventsMap() {
        const filterOptionLookUpVsComparison: Map<string, string> = new Map<string, string>();
        filterOptionLookUpVsComparison.set('did occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur greater than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did not occur less than N days ago', 'number of days');
        filterOptionLookUpVsComparison.set('did occur', 'true');
        filterOptionLookUpVsComparison.set('did not occur', 'true');
        filterOptionLookUpVsComparison.set('before', 'date');
        filterOptionLookUpVsComparison.set('after', 'date');
        this.pokerEventsMap.set('deposit', filterOptionLookUpVsComparison);
        this.pokerEventsMap.set('registration', filterOptionLookUpVsComparison);
    }

    populateTagsMaps() {
        this.populateSportsTagsMap();
        this.populateCasinoTagsMap();
        this.populatePokerTagsMap();
    }

    populateSportsTagsMap() {
        let filterOptionLookUpComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['true', 'false']);
        this.sportsTagsMap.set('hasLoggedIn', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['true', 'false']);
        this.sportsTagsMap.set('lastBetInPlay', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('before', ['date']);
        filterOptionLookUpComparisonVsValue.set('was', ['date']);
        filterOptionLookUpComparisonVsValue.set('after', ['date']);
        filterOptionLookUpComparisonVsValue.set('within', ['the last 2 days', 'the last 7 days', 'the last 2 weeks', 'the last month']);
        filterOptionLookUpComparisonVsValue.set('days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('greater than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('less than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('exists', ['true', 'false']);
        this.sportsTagsMap.set('lastBetOnBasketBall', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnBlackJack', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnFootball', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnOther', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnRoulette', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnTennis', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastBetOnVolleyball', filterOptionLookUpComparisonVsValue);
        this.sportsTagsMap.set('lastLoginDate', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('equals', ['tagValue']);
        filterOptionLookUpComparisonVsValue.set('not equals', ['tagValue']);
        filterOptionLookUpComparisonVsValue.set('less than', ['Number']);
        filterOptionLookUpComparisonVsValue.set('greater than', ['Number']);
        filterOptionLookUpComparisonVsValue.set('exists', ['true', 'false']);
        this.sportsTagsMap.set('lastSessionCloseBalance', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['leagueNameId']);
        filterOptionLookUpComparisonVsValue.set('is not', ['leagueNameId']);
        this.sportsTagsMap.set('lastBetOnLeague', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['eventId']);
        filterOptionLookUpComparisonVsValue.set('is not', ['eventId']);
        this.sportsTagsMap.set('lastEventIdBacked', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['leagueName']);
        filterOptionLookUpComparisonVsValue.set('is not', ['leagueName']);
        this.sportsTagsMap.set('lastBetOnPremierLeague', filterOptionLookUpComparisonVsValue);
    }

    populateCasinoTagsMap() {
        let filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('before', ['date']);
        filterOptionLookUpComparisonVsValue.set('was', ['date']);
        filterOptionLookUpComparisonVsValue.set('after', ['date']);
        filterOptionLookUpComparisonVsValue.set('within', ['the last 2 days', 'the last 7 days', 'the last 2 weeks', 'the last month']);
        filterOptionLookUpComparisonVsValue.set('days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('greater than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('less than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('exists', ['true', 'false']);
        this.casinoTagsMap.set('lastOpenedGame', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastOpenedGameWithJackpots', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastPlayedGameWithJackpots', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastPlayedBlackjack', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastPlayedRoulette', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastPlayedSlots', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['true', 'false']);
        this.casinoTagsMap.set('hasLoggedIn', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('equals', ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('not equals', ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('less than', ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('greater than', ['stake amount']);
        this.casinoTagsMap.set('lastStakeBlackJack_play', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastStakeBlackJack_real', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastStakeRoulette_play', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastStakeRoulette_real', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastStakeSlots_real', filterOptionLookUpComparisonVsValue);
        this.casinoTagsMap.set('lastStakeSlots_play', filterOptionLookUpComparisonVsValue);
    }

    populatePokerTagsMap() {
        let filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('did occur N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did occur greater than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did occur less than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did not occur N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did not occur greater than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did not occur less than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('did occur', ['true', 'false']);
        filterOptionLookUpComparisonVsValue.set('before', ['date']);
        filterOptionLookUpComparisonVsValue.set('after', ['date']);
        this.pokerTagsMap.set('lastTournamentRegister', filterOptionLookUpComparisonVsValue);

        filterOptionLookUpComparisonVsValue = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', ['true', 'false']);
        this.pokerTagsMap.set('hasLoggedIn', filterOptionLookUpComparisonVsValue);
    }
    isOptionLookUpHidden(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        switch (targetGroupFilterCriterionFormControl.get('filterOption').value) {
            case 'Tag':
            case 'Event': {
                return false;
            }
            default: return true;
        }
    }
    getFilterOptionLookUpValues(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const targetGroupFiltersFilterOptionValues = targetGroupCriterionFormControl.get('filterOption').value;
        const lookupValues: string[] = [];

        if (targetGroupFiltersFilterOptionValues && targetGroupFiltersFilterOptionValues !== '') {
            switch (this.campaignTemplateGroupCreationForm.get('product').value) {
                case 'SPORTS': {
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event': {
                                this.sportsEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag': {
                                this.sportsTagsMap.forEach((value: Map<string, string[]>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            default: return [''];
                        }
                    }
                    return [''];
                }
                case 'POKER': {
                    // alert(targetGroupCriterionFormControl.get('filterOption').value);
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event': {
                                this.pokerEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag': {
                                this.pokerTagsMap.forEach((value: Map<string, string[]>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            default: return [''];
                        }
                    }
                    return [''];
                }
                case 'CASINO': {
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event': {
                                this.casinoEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag': {
                                this.casinoTagsMap.forEach((value: Map<string, string[]>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            default: return [''];
                        }
                    }
                    return [''];
                }
                default: return [''];
            }
        } else {
            return [''];
        }
    }
    getFilterOptionComparisonValues(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const product = this.campaignTemplateGroupCreationForm.get('product').value;
        const targetGroupCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const targetGroupFiltersFilterOptionSelected: string = targetGroupCriterionFormControl.get('filterOption').value;
        const filterOptionComparisonValues: string[] = [];
        if (targetGroupFiltersFilterOptionSelected && targetGroupFiltersFilterOptionSelected !== '') {
            switch (targetGroupFiltersFilterOptionSelected) {
                case 'App': {
                    this.filtersMap.get('App').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'App Version': {
                    const appVersionComparisons = this.appVersionMap.get('App Version');
                    for (const appVersionComparison of appVersionComparisons) {
                        filterOptionComparisonValues.push(appVersionComparison);
                    }
                }
                    break;
                case 'Country': {
                    this.filtersMap.get('Country').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Install Date': {
                    this.filtersMap.get('Install Date').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Language': {
                    this.filtersMap.get('Language').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Last Open Date': {
                    this.filtersMap.get('Last Open Date').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'OS': {
                    this.filtersMap.get('OS').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Timezone': {
                    this.filtersMap.get('Timezone').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Sessions': {
                    this.filtersMap.get('Sessions').forEach((value: string[], key: string) => {
                        filterOptionComparisonValues.push(key);
                    });
                }
                    break;
                case 'Segment': {
                    if (this.filtersMap.has("Segment")) {
                        this.filtersMap.get('Segment').forEach((value: string[], key: string) => {
                            filterOptionComparisonValues.push(key);
                        });
                    }
                }
                    break;
                case 'Event': {
                    switch (product) {
                        case 'SPORTS': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string> = this.sportsEventsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string, key: string) => {
                                    filterOptionComparisonValues.push(key);
                                });
                            }
                        }
                            break;
                        case 'POKER': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string> = this.pokerEventsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string, key: string) => {
                                    filterOptionComparisonValues.push(key);
                                });
                            }
                        }
                            break;
                        case 'CASINO': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string> = this.casinoEventsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string, key: string) => {
                                    filterOptionComparisonValues.push(key);
                                });
                            }
                        }
                            break;
                        default: break;
                    }
                }
                    break;
                case 'Tag': {
                    switch (product) {
                        case 'SPORTS': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string[]> = this.sportsTagsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string[], key: string) => {
                                    filterOptionComparisonValues.push(key);
                                });
                            }
                        }
                            break;
                        case 'POKER': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string[]> = this.pokerTagsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string[], key: string) => {
                                    filterOptionComparisonValues.push(key);
                                    console.log(filterOptionComparisonValues);
                                });
                            }
                        }
                            break;
                        case 'CASINO': {
                            const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
                            if (filterOptionLookUpSelected) {
                                const filterOptionLookUpComparisonVsValue: Map<string, string[]> = this.casinoTagsMap.get(filterOptionLookUpSelected);
                                filterOptionLookUpComparisonVsValue.forEach((value: string[], key: string) => {
                                    filterOptionComparisonValues.push(key);
                                });
                            }
                        }
                            break;
                        default: break;
                    }
                }
                    break;
                default: break;
            }
            return filterOptionComparisonValues;
        } else {
            return filterOptionComparisonValues;
        }
    }
    getFormControlType(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const filterOption: string = targetGroupFilterCriterionFormControl.get('filterOption').value;
        const filterOptionLookUp: string = targetGroupFilterCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparison: string = targetGroupFilterCriterionFormControl.get('filterOptionComparison').value;
        const productSelected: string = this.campaignTemplateGroupCreationForm.get('product').value;
        if (filterOption && filterOptionComparison) {
            switch (filterOption) {
                case 'Tag': {
                    // targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
                    switch (productSelected) {
                        case 'SPORTS': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                return this.getFormControlTypeFromFilterOptionValues(this.sportsTagsMap.get(filterOptionLookUp).get(filterOptionComparison));
                            }
                        }
                            break;
                        case 'POKER': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                return this.getFormControlTypeFromFilterOptionValues(this.pokerTagsMap.get(filterOptionLookUp).get(filterOptionComparison));
                            }
                        }
                            break;
                        case 'CASINO': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                return this.getFormControlTypeFromFilterOptionValues(this.casinoTagsMap.get(filterOptionLookUp).get(filterOptionComparison));
                            }
                        }
                            break;
                    }
                }
                    break;
                case 'Event': {
                    switch (productSelected) {
                        case 'SPORTS': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                switch (this.sportsEventsMap.get(filterOptionLookUp).get(filterOptionComparison)) {
                                    case 'number of days': return 'daysCounter';
                                    case 'date': return 'simpleDate';
                                    default: return 'dropdown';
                                }
                            }
                        }
                            break;
                        case 'POKER': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                switch (this.pokerEventsMap.get(filterOptionLookUp).get(filterOptionComparison)) {
                                    case 'number of days': return 'daysCounter';
                                    case 'date': return 'simpleDate';
                                    default: return 'textbox';
                                }
                            }
                        }
                            break;
                        case 'CASINO': {
                            if (filterOptionLookUp && filterOptionLookUp !== '') {
                                switch (this.casinoEventsMap.get(filterOptionLookUp).get(filterOptionComparison)) {
                                    case 'number of days': return 'daysCounter';
                                    case 'date': return 'simpleDate';
                                    default: return 'textbox';
                                }
                            }
                        }
                            break;
                        default: return 'textbox';
                    }
                }
                    break;
                case 'App Version': {
                    return 'appVersionSelector';
                }
                case 'Language':
                case 'Country': {
                    const formControlType = this.getFormControlTypeFromFilterOptionValues(this.filtersMap.get(filterOption).get(filterOptionComparison));
                    if (formControlType === 'dropdown' || formControlType === 'dropdownWithObj') {
                        return 'multiSelectDropdown';
                    } else {
                        return formControlType;
                    }
                }
                default: {
                    if (this.filtersMap.has(filterOption)) {
                        return this.getFormControlTypeFromFilterOptionValues(this.filtersMap.get(filterOption).get(filterOptionComparison));
                    }
                    return 'textbox';
                }
            }
        } else {
            return 'textbox';
        }
        return 'textbox';
    }

    getFilterOptionValueValues(index) {

        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const filterOptionSelected: string = targetGroupCriterionFormControl.get('filterOption').value;
        const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparisonSelected: string = targetGroupCriterionFormControl.get('filterOptionComparison').value;

        const filterOptionValueSelected: string[] = targetGroupCriterionFormControl.get('filterOptionValue').value;
        const productSelected: string = this.campaignTemplateGroupCreationForm.get('product').value;
        const optionValues: string[] = [];

        if (filterOptionSelected && filterOptionSelected !== '' &&
            filterOptionComparisonSelected && filterOptionComparisonSelected !== '') {
            // if(filterOptionSelected === 'Country' && filterOptionValueSelected.length > 0) {
            //     for(let i=0; i< filterOptionValueSelected.length; i++) {
            //         optionValues.push(filterOptionValueSelected[i]);
            //     }
            //     return optionValues;
            // }
            switch (filterOptionSelected) {
                case 'App':
                case 'Country':
                case 'Install Date':
                case 'Language':
                case 'Last Open Date':
                case 'OS':
                case 'Segment':
                case 'Timezone':
                    this.filtersMap.get(filterOptionSelected).get(filterOptionComparisonSelected).forEach((value: string) => {
                        optionValues.push(value);
                    });
                    return optionValues;
                case 'Event': {
                    switch (productSelected) {
                        case 'SPORTS': {
                            if (filterOptionLookUpSelected) {
                                optionValues.push(this.sportsEventsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected));
                            }
                        }
                            break;
                        case 'POKER': {
                            if (filterOptionLookUpSelected) {
                                optionValues.push(this.pokerEventsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected));
                            }
                        }
                            break;
                        case 'CASINO': {
                            if (filterOptionLookUpSelected) {
                                optionValues.push(this.casinoEventsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected));
                            }
                        }
                            break;
                        default: break;
                    }
                }
                    break;
                case 'Tag': {
                    switch (productSelected) {
                        case 'SPORTS': {
                            if (filterOptionLookUpSelected) {
                                return this.sportsTagsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected);
                            }
                        }
                            break;
                        case 'POKER': {
                            if (filterOptionLookUpSelected) {
                                return this.pokerTagsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected);
                            }
                        }
                            break;
                        case 'CASINO': {
                            if (filterOptionLookUpSelected) {
                                return this.casinoTagsMap.get(filterOptionLookUpSelected).get(filterOptionComparisonSelected);
                            }
                        }
                            break;
                        default: break;
                    }
                }
                    break;
            }
        }
        return optionValues;
    }
    getFormControlTypeFromFilterOptionValues(formOptionValues: string[]) {
        if (formOptionValues && formOptionValues.length === 1) {
            if (formOptionValues[0] === 'number of days') {
                return 'daysCounter';
            } else if (formOptionValues[0] === 'date') {
                return 'simpleDate';
            } else if (formOptionValues[0] === 'tagValue') {
                return 'tagValue';
            } else if (formOptionValues[0] === 'leagueName') {
                return 'leagueName';
            } else if (formOptionValues[0] === 'leagueNameId') {
                return 'leagueNameId';
            } else if (formOptionValues[0] === 'eventId') {
                return 'eventId';
            }
            else if (formOptionValues[0] === 'Number') {
                return 'Number';
            }
            else if (formOptionValues[0]) {
                return (typeof formOptionValues[0] === 'object' ? 'dropdownWithObj' : 'dropdown');
            }
        } else if (formOptionValues && formOptionValues.length > 1) {
            return (typeof formOptionValues[0] === 'object' ? 'dropdownWithObj' : 'dropdown');
        } else {
            return '';
        }
    }
    isOptionValueSelectionHidden(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const filterOption: string = targetGroupFilterCriterionFormControl.get('filterOption').value;
        const filterOptionLookUp: string = targetGroupFilterCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparison: string = targetGroupFilterCriterionFormControl.get('filterOptionComparison').value;
        if (filterOption) {
            switch (filterOption) {
                case 'Tag':
                case 'Event': {
                    return !filterOptionLookUp || filterOptionLookUp === '' || !filterOptionComparison || filterOptionComparison === '';
                }
                default: return false;
            }
        }
        return false;
    }
    populateFiltersMap() {
        this.populateAppParams();
        this.populateAppVersionParams();
        this.populateTimeZoneParams();
        this.populateSessionParams();
        this.populateLanguageParams();
        this.populateCountryParams();
        this.populateInstallDateParams();
        this.populateOSParams();
    }
    populateAppParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        let comparisonValues: string[] = [];
        comparisonValues = ['opened in the last 2 days', 'opened in the last 2 weeks', 'opened in the last month'];
        filterComparisonVsValue.set('was', comparisonValues);
        comparisonValues = ['opened in the last 2 days', 'opened in the last 2 weeks', 'opened in the last month'];
        filterComparisonVsValue.set('was not', comparisonValues);
        this.filtersMap.set('App', filterComparisonVsValue);
    }

    populateAppVersionParams() {
        const appVersionComparisons: string[] = ['equals', 'not equals', 'greater than', 'less than', 'greater than or equal', 'less than or equal'];
        this.appVersionMap.set('App Version', appVersionComparisons);
    }

    populateTimeZoneParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', TIME_ZONES);
        filterComparisonVsValue.set('is not', TIME_ZONES);
        this.filtersMap.set('Timezone', filterComparisonVsValue);
    }

    populateSessionParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('less than', ['Number']);
        filterComparisonVsValue.set('greater than', ['Number']);
        this.filtersMap.set('Sessions', filterComparisonVsValue);
    }

    /*populateLanguageParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', LANGUAGES);
        filterComparisonVsValue.set('is not', LANGUAGES);
        this.filtersMap.set('Language', filterComparisonVsValue);
    }*/

    populateCountryParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', this.countries);
        filterComparisonVsValue.set('is not', this.countries);
        this.filtersMap.set('Country', filterComparisonVsValue);
    }

    populateLanguageParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', this.languages);
        filterComparisonVsValue.set('is not', this.languages);
        this.filtersMap.set('Language', filterComparisonVsValue);
    }

    populateInstallDateParams() {
        const filterOptionLookUpComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('before', ['date']);
        filterOptionLookUpComparisonVsValue.set('was', ['date']);
        filterOptionLookUpComparisonVsValue.set('after', ['date']);
        filterOptionLookUpComparisonVsValue.set('within', ['the last 2 days', 'the last 7 days', 'the last 2 weeks', 'the last month']);
        filterOptionLookUpComparisonVsValue.set('days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('greater than N days ago', ['number of days']);
        filterOptionLookUpComparisonVsValue.set('less than N days ago', ['number of days']);
        this.filtersMap.set('Install Date', filterOptionLookUpComparisonVsValue);
        this.filtersMap.set('Last Open Date', filterOptionLookUpComparisonVsValue);
    }

    populateOSParams() {
        const filterOptionLookUpComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is', this.operatingSystems);
        filterOptionLookUpComparisonVsValue.set('is not', this.operatingSystems);
        this.filtersMap.set('OS', filterOptionLookUpComparisonVsValue);
    }

    populateSegmentParams() {
        const filterOptionLookUpComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterOptionLookUpComparisonVsValue.set('is in', this.segmentNames);
        filterOptionLookUpComparisonVsValue.set('is not in', this.segmentNames);
        this.filtersMap.set('Segment', filterOptionLookUpComparisonVsValue);
    }
    populateCountries() {
        this.countries = [{"id":"Afghanistan","itemName":"Afghanistan"},{"id":"Aland Islands","itemName":"Aland Islands"},{"id":"Albania","itemName":"Albania"},{"id":"Algeria","itemName":"Algeria"},{"id":"American Samoa","itemName":"American Samoa"},{"id":"Andorra","itemName":"Andorra"},{"id":"Angola","itemName":"Angola"},{"id":"Anguilla","itemName":"Anguilla"},{"id":"Antarctica","itemName":"Antarctica"},{"id":"Antigua and Barbuda","itemName":"Antigua and Barbuda"},{"id":"Argentina","itemName":"Argentina"},{"id":"Armenia","itemName":"Armenia"},{"id":"Aruba","itemName":"Aruba"},{"id":"Australia","itemName":"Australia"},{"id":"Austria","itemName":"Austria"},{"id":"Azerbaijan","itemName":"Azerbaijan"},{"id":"Bahamas","itemName":"Bahamas"},{"id":"Bahrain","itemName":"Bahrain"},{"id":"Bangladesh","itemName":"Bangladesh"},{"id":"Barbados","itemName":"Barbados"},{"id":"Belarus","itemName":"Belarus"},{"id":"Belgium","itemName":"Belgium"},{"id":"Belize","itemName":"Belize"},{"id":"Benin","itemName":"Benin"},{"id":"Bermuda","itemName":"Bermuda"},{"id":"Bhutan","itemName":"Bhutan"},{"id":"Bolivia","itemName":"Bolivia"},{"id":"Bosnia and Herzegovina","itemName":"Bosnia and Herzegovina"},{"id":"Botswana","itemName":"Botswana"},{"id":"Bouvet Island","itemName":"Bouvet Island"},{"id":"Brazil","itemName":"Brazil"},{"id":"British Virgin Islands","itemName":"British Virgin Islands"},{"id":"British Indian Ocean Territory","itemName":"British Indian Ocean Territory"},{"id":"Brunei Darussalam","itemName":"Brunei Darussalam"},{"id":"Bulgaria","itemName":"Bulgaria"},{"id":"Burkina Faso","itemName":"Burkina Faso"},{"id":"Burundi","itemName":"Burundi"},{"id":"Cambodia","itemName":"Cambodia"},{"id":"Cameroon","itemName":"Cameroon"},{"id":"Canada","itemName":"Canada"},{"id":"Cape Verde","itemName":"Cape Verde"},{"id":"Cayman Islands","itemName":"Cayman Islands"},{"id":"Central African Republic","itemName":"Central African Republic"},{"id":"Chad","itemName":"Chad"},{"id":"Chile","itemName":"Chile"},{"id":"China","itemName":"China"},{"id":"Hong Kong, SAR China","itemName":"Hong Kong, SAR China"},{"id":"Macao, SAR China","itemName":"Macao, SAR China"},{"id":"Christmas Island","itemName":"Christmas Island"},{"id":"Cocos (Keeling) Islands","itemName":"Cocos (Keeling) Islands"},{"id":"Colombia","itemName":"Colombia"},{"id":"Comoros","itemName":"Comoros"},{"id":"Congo (Brazzaville)","itemName":"Congo (Brazzaville)"},{"id":"Congo, (Kinshasa)","itemName":"Congo, (Kinshasa)"},{"id":"Cook Islands","itemName":"Cook Islands"},{"id":"Costa Rica","itemName":"Costa Rica"},{"id":"Côte d'Ivoire","itemName":"Côte d'Ivoire"},{"id":"Croatia","itemName":"Croatia"},{"id":"Cuba","itemName":"Cuba"},{"id":"Cyprus","itemName":"Cyprus"},{"id":"Czech Republic","itemName":"Czech Republic"},{"id":"Denmark","itemName":"Denmark"},{"id":"Djibouti","itemName":"Djibouti"},{"id":"Dominica","itemName":"Dominica"},{"id":"Dominican Republic","itemName":"Dominican Republic"},{"id":"Ecuador","itemName":"Ecuador"},{"id":"Egypt","itemName":"Egypt"},{"id":"El Salvador","itemName":"El Salvador"},{"id":"Equatorial Guinea","itemName":"Equatorial Guinea"},{"id":"Eritrea","itemName":"Eritrea"},{"id":"Estonia","itemName":"Estonia"},{"id":"Ethiopia","itemName":"Ethiopia"},{"id":"Falkland Islands (Malvinas)","itemName":"Falkland Islands (Malvinas)"},{"id":"Faroe Islands","itemName":"Faroe Islands"},{"id":"Fiji","itemName":"Fiji"},{"id":"Finland","itemName":"Finland"},{"id":"France","itemName":"France"},{"id":"French Guiana","itemName":"French Guiana"},{"id":"French Polynesia","itemName":"French Polynesia"},{"id":"French Southern Territories","itemName":"French Southern Territories"},{"id":"Gabon","itemName":"Gabon"},{"id":"Gambia","itemName":"Gambia"},{"id":"Georgia","itemName":"Georgia"},{"id":"Germany","itemName":"Germany"},{"id":"Ghana","itemName":"Ghana"},{"id":"Gibraltar","itemName":"Gibraltar"},{"id":"Greece","itemName":"Greece"},{"id":"Greenland","itemName":"Greenland"},{"id":"Grenada","itemName":"Grenada"},{"id":"Guadeloupe","itemName":"Guadeloupe"},{"id":"Guam","itemName":"Guam"},{"id":"Guatemala","itemName":"Guatemala"},{"id":"Guernsey","itemName":"Guernsey"},{"id":"Guinea","itemName":"Guinea"},{"id":"Guinea-Bissau","itemName":"Guinea-Bissau"},{"id":"Guyana","itemName":"Guyana"},{"id":"Haiti","itemName":"Haiti"},{"id":"Heard and Mcdonald Islands","itemName":"Heard and Mcdonald Islands"},{"id":"Holy See (Vatican City State)","itemName":"Holy See (Vatican City State)"},{"id":"Honduras","itemName":"Honduras"},{"id":"Hungary","itemName":"Hungary"},{"id":"Iceland","itemName":"Iceland"},{"id":"India","itemName":"India"},{"id":"Indonesia","itemName":"Indonesia"},{"id":"Iran, Islamic Republic of","itemName":"Iran, Islamic Republic of"},{"id":"Iraq","itemName":"Iraq"},{"id":"Ireland","itemName":"Ireland"},{"id":"Isle of Man","itemName":"Isle of Man"},{"id":"Israel","itemName":"Israel"},{"id":"Italy","itemName":"Italy"},{"id":"Jamaica","itemName":"Jamaica"},{"id":"Japan","itemName":"Japan"},{"id":"Jersey","itemName":"Jersey"},{"id":"Jordan","itemName":"Jordan"},{"id":"Kazakhstan","itemName":"Kazakhstan"},{"id":"Kenya","itemName":"Kenya"},{"id":"Kiribati","itemName":"Kiribati"},{"id":"Korea (North)","itemName":"Korea (North)"},{"id":"Korea (South)","itemName":"Korea (South)"},{"id":"Kuwait","itemName":"Kuwait"},{"id":"Kyrgyzstan","itemName":"Kyrgyzstan"},{"id":"Lao PDR","itemName":"Lao PDR"},{"id":"Latvia","itemName":"Latvia"},{"id":"Lebanon","itemName":"Lebanon"},{"id":"Lesotho","itemName":"Lesotho"},{"id":"Liberia","itemName":"Liberia"},{"id":"Libya","itemName":"Libya"},{"id":"Liechtenstein","itemName":"Liechtenstein"},{"id":"Lithuania","itemName":"Lithuania"},{"id":"Luxembourg","itemName":"Luxembourg"},{"id":"Macedonia, Republic of","itemName":"Macedonia, Republic of"},{"id":"Madagascar","itemName":"Madagascar"},{"id":"Malawi","itemName":"Malawi"},{"id":"Malaysia","itemName":"Malaysia"},{"id":"Maldives","itemName":"Maldives"},{"id":"Mali","itemName":"Mali"},{"id":"Malta","itemName":"Malta"},{"id":"Marshall Islands","itemName":"Marshall Islands"},{"id":"Martinique","itemName":"Martinique"},{"id":"Mauritania","itemName":"Mauritania"},{"id":"Mauritius","itemName":"Mauritius"},{"id":"Mayotte","itemName":"Mayotte"},{"id":"Mexico","itemName":"Mexico"},{"id":"Micronesia, Federated States of","itemName":"Micronesia, Federated States of"},{"id":"Moldova","itemName":"Moldova"},{"id":"Monaco","itemName":"Monaco"},{"id":"Mongolia","itemName":"Mongolia"},{"id":"Montenegro","itemName":"Montenegro"},{"id":"Montserrat","itemName":"Montserrat"},{"id":"Morocco","itemName":"Morocco"},{"id":"Mozambique","itemName":"Mozambique"},{"id":"Myanmar","itemName":"Myanmar"},{"id":"Namibia","itemName":"Namibia"},{"id":"Nauru","itemName":"Nauru"},{"id":"Nepal","itemName":"Nepal"},{"id":"Netherlands","itemName":"Netherlands"},{"id":"Netherlands Antilles","itemName":"Netherlands Antilles"},{"id":"New Caledonia","itemName":"New Caledonia"},{"id":"New Zealand","itemName":"New Zealand"},{"id":"Nicaragua","itemName":"Nicaragua"},{"id":"Niger","itemName":"Niger"},{"id":"Nigeria","itemName":"Nigeria"},{"id":"Niue","itemName":"Niue"},{"id":"Norfolk Island","itemName":"Norfolk Island"},{"id":"Northern Mariana Islands","itemName":"Northern Mariana Islands"},{"id":"Norway","itemName":"Norway"},{"id":"Oman","itemName":"Oman"},{"id":"Pakistan","itemName":"Pakistan"},{"id":"Palau","itemName":"Palau"},{"id":"Palestinian Territory","itemName":"Palestinian Territory"},{"id":"Panama","itemName":"Panama"},{"id":"Papua New Guinea","itemName":"Papua New Guinea"},{"id":"Paraguay","itemName":"Paraguay"},{"id":"Peru","itemName":"Peru"},{"id":"Philippines","itemName":"Philippines"},{"id":"Pitcairn","itemName":"Pitcairn"},{"id":"Poland","itemName":"Poland"},{"id":"Portugal","itemName":"Portugal"},{"id":"Puerto Rico","itemName":"Puerto Rico"},{"id":"Qatar","itemName":"Qatar"},{"id":"Réunion","itemName":"Réunion"},{"id":"Romania","itemName":"Romania"},{"id":"Russian Federation","itemName":"Russian Federation"},{"id":"Rwanda","itemName":"Rwanda"},{"id":"Saint-Barthélemy","itemName":"Saint-Barthélemy"},{"id":"Saint Helena","itemName":"Saint Helena"},{"id":"Saint Kitts and Nevis","itemName":"Saint Kitts and Nevis"},{"id":"Saint Lucia","itemName":"Saint Lucia"},{"id":"Saint-Martin (French part)","itemName":"Saint-Martin (French part)"},{"id":"Saint Pierre and Miquelon","itemName":"Saint Pierre and Miquelon"},{"id":"Saint Vincent and Grenadines","itemName":"Saint Vincent and Grenadines"},{"id":"Samoa","itemName":"Samoa"},{"id":"San Marino","itemName":"San Marino"},{"id":"Sao Tome and Principe","itemName":"Sao Tome and Principe"},{"id":"Saudi Arabia","itemName":"Saudi Arabia"},{"id":"Senegal","itemName":"Senegal"},{"id":"Serbia","itemName":"Serbia"},{"id":"Seychelles","itemName":"Seychelles"},{"id":"Sierra Leone","itemName":"Sierra Leone"},{"id":"Singapore","itemName":"Singapore"},{"id":"Slovakia","itemName":"Slovakia"},{"id":"Slovenia","itemName":"Slovenia"},{"id":"Solomon Islands","itemName":"Solomon Islands"},{"id":"Somalia","itemName":"Somalia"},{"id":"South Africa","itemName":"South Africa"},{"id":"South Georgia and the South Sandwich Islands","itemName":"South Georgia and the South Sandwich Islands"},{"id":"South Sudan","itemName":"South Sudan"},{"id":"Spain","itemName":"Spain"},{"id":"Sri Lanka","itemName":"Sri Lanka"},{"id":"Sudan","itemName":"Sudan"},{"id":"Suriname","itemName":"Suriname"},{"id":"Svalbard and Jan Mayen Islands","itemName":"Svalbard and Jan Mayen Islands"},{"id":"Swaziland","itemName":"Swaziland"},{"id":"Sweden","itemName":"Sweden"},{"id":"Switzerland","itemName":"Switzerland"},{"id":"Syrian Arab Republic (Syria)","itemName":"Syrian Arab Republic (Syria)"},{"id":"Taiwan, Republic of China","itemName":"Taiwan, Republic of China"},{"id":"Tajikistan","itemName":"Tajikistan"},{"id":"Tanzania, United Republic of","itemName":"Tanzania, United Republic of"},{"id":"Thailand","itemName":"Thailand"},{"id":"Timor-Leste","itemName":"Timor-Leste"},{"id":"Togo","itemName":"Togo"},{"id":"Tokelau","itemName":"Tokelau"},{"id":"Tonga","itemName":"Tonga"},{"id":"Trinidad and Tobago","itemName":"Trinidad and Tobago"},{"id":"Tunisia","itemName":"Tunisia"},{"id":"Turkey","itemName":"Turkey"},{"id":"Turkmenistan","itemName":"Turkmenistan"},{"id":"Turks and Caicos Islands","itemName":"Turks and Caicos Islands"},{"id":"Tuvalu","itemName":"Tuvalu"},{"id":"Uganda","itemName":"Uganda"},{"id":"Ukraine","itemName":"Ukraine"},{"id":"United Arab Emirates","itemName":"United Arab Emirates"},{"id":"United Kingdom","itemName":"United Kingdom"},{"id":"United States of America","itemName":"United States of America"},{"id":"US Minor Outlying Islands","itemName":"US Minor Outlying Islands"},{"id":"Uruguay","itemName":"Uruguay"},{"id":"Uzbekistan","itemName":"Uzbekistan"},{"id":"Vanuatu","itemName":"Vanuatu"},{"id":"Venezuela (Bolivarian Republic)","itemName":"Venezuela (Bolivarian Republic)"},{"id":"Viet Nam","itemName":"Viet Nam"},{"id":"Virgin Islands, US","itemName":"Virgin Islands, US"},{"id":"Wallis and Futuna Islands","itemName":"Wallis and Futuna Islands"},{"id":"Western Sahara","itemName":"Western Sahara"},{"id":"Yemen","itemName":"Yemen"},{"id":"Zambia","itemName":"Zambia"},{"id":"Zimbabwe","itemName":"Zimbabwe"}];
    }
    populateLanguages() {
        this.languages = [{"id":"Afrikaans","itemName":"Afrikaans"},{"id":"Albanian","itemName":"Albanian"},{"id":"Arabic","itemName":"Arabic"},{"id":"Aragonese","itemName":"Aragonese"},{"id":"Armenian","itemName":"Armenian"},{"id":"Assamese","itemName":"Assamese"},{"id":"Avestan","itemName":"Avestan"},{"id":"Azerbaijani","itemName":"Azerbaijani"},{"id":"Bambara","itemName":"Bambara"},{"id":"Bashkir","itemName":"Bashkir"},{"id":"Belarusian","itemName":"Belarusian"},{"id":"Bengali","itemName":"Bengali"},{"id":"Bihari","itemName":"Bihari"},{"id":"Bislama","itemName":"Bislama"},{"id":"Bosnian","itemName":"Bosnian"},{"id":"Breton","itemName":"Breton"},{"id":"Bulgarian","itemName":"Bulgarian"},{"id":"Burmese","itemName":"Burmese"},{"id":"Catalan","itemName":"Catalan"},{"id":"Chamorro","itemName":"Chamorro"},{"id":"Chinese","itemName":"Chinese"},{"id":"Chuvash","itemName":"Chuvash"},{"id":"Corsican","itemName":"Corsican"},{"id":"Cree","itemName":"Cree"},{"id":"Croatian","itemName":"Croatian"},{"id":"Czech","itemName":"Czech"},{"id":"Danish","itemName":"Danish"},{"id":"Dutch","itemName":"Dutch"},{"id":"Dzongkha","itemName":"Dzongkha"},{"id":"English","itemName":"English"},{"id":"Estonian","itemName":"Estonian"},{"id":"Ewe","itemName":"Ewe"},{"id":"Faroese","itemName":"Faroese"},{"id":"Fijian","itemName":"Fijian"},{"id":"Finnish","itemName":"Finnish"},{"id":"French","itemName":"French"},{"id":"Gaelic","itemName":"Gaelic"},{"id":"Galician","itemName":"Galician"},{"id":"Georgian","itemName":"Georgian"},{"id":"German","itemName":"German"},{"id":"Greek","itemName":"Greek"},{"id":"Guarana","itemName":"Guarana"},{"id":"Gujarati","itemName":"Gujarati"},{"id":"Haitian","itemName":"Haitian"},{"id":"Hebrew","itemName":"Hebrew"},{"id":"Hindi","itemName":"Hindi"},{"id":"Hungarian","itemName":"Hungarian"},{"id":"Icelandic","itemName":"Icelandic"},{"id":"Ido","itemName":"Ido"},{"id":"Indonesian","itemName":"Indonesian"},{"id":"Irish","itemName":"Irish"},{"id":"Italian","itemName":"Italian"},{"id":"Japanese","itemName":"Japanese"},{"id":"Kannada","itemName":"Kannada"},{"id":"Khmer","itemName":"Khmer"},{"id":"Kikuyu","itemName":"Kikuyu"},{"id":"Kinyarwanda","itemName":"Kinyarwanda"},{"id":"Kongo","itemName":"Kongo"},{"id":"Korean","itemName":"Korean"},{"id":"Kyrgyz","itemName":"Kyrgyz"},{"id":"Latvian","itemName":"Latvian"},{"id":"Limburgish","itemName":"Limburgish"},{"id":"Lithuanian","itemName":"Lithuanian"},{"id":"Luxembourgish","itemName":"Luxembourgish"},{"id":"Macedonian","itemName":"Macedonian"},{"id":"Malagasy","itemName":"Malagasy"},{"id":"Malay","itemName":"Malay"},{"id":"Malayalam","itemName":"Malayalam"},{"id":"Maltese","itemName":"Maltese"},{"id":"Marshallese","itemName":"Marshallese"},{"id":"Mongolian","itemName":"Mongolian"},{"id":"Nauru","itemName":"Nauru"},{"id":"Ndonga","itemName":"Ndonga"},{"id":"Nepali","itemName":"Nepali"},{"id":"Northern Sami","itemName":"Northern Sami"},{"id":"Norwegian","itemName":"Norwegian"},{"id":"Oromo","itemName":"Oromo"},{"id":"Pashto","itemName":"Pashto"},{"id":"Persian","itemName":"Persian"},{"id":"Polish","itemName":"Polish"},{"id":"Portuguese","itemName":"Portuguese"},{"id":"Punjabi","itemName":"Punjabi"},{"id":"Romanian","itemName":"Romanian"},{"id":"Russian","itemName":"Russian"},{"id":"Samoan","itemName":"Samoan"},{"id":"Sango","itemName":"Sango"},{"id":"Sanskrit","itemName":"Sanskrit"},{"id":"Sardinian","itemName":"Sardinian"},{"id":"Serbian","itemName":"Serbian"},{"id":"Shona","itemName":"Shona"},{"id":"Sindhi","itemName":"Sindhi"},{"id":"Sinhala","itemName":"Sinhala"},{"id":"Slovak","itemName":"Slovak"},{"id":"Slovene","itemName":"Slovene"},{"id":"Somali","itemName":"Somali"},{"id":"Southern Ndebele","itemName":"Southern Ndebele"},{"id":"Southern Sotho","itemName":"Southern Sotho"},{"id":"Spanish","itemName":"Spanish"},{"id":"Swedish","itemName":"Swedish"},{"id":"Tagalog","itemName":"Tagalog"},{"id":"Tajik","itemName":"Tajik"},{"id":"Tatar","itemName":"Tatar"},{"id":"Thai","itemName":"Thai"},{"id":"Tibetan Standard","itemName":"Tibetan Standard"},{"id":"Tonga","itemName":"Tonga"},{"id":"Tswana","itemName":"Tswana"},{"id":"Turkish","itemName":"Turkish"},{"id":"Turkmen","itemName":"Turkmen"},{"id":"Twi","itemName":"Twi"},{"id":"Ukranian","itemName":"Ukranian"},{"id":"Urdu","itemName":"Urdu"},{"id":"Uyghur","itemName":"Uyghur"},{"id":"Uzbek","itemName":"Uzbek"},{"id":"Venda","itemName":"Venda"},{"id":"Vietnamese","itemName":"Vietnamese"},{"id":"Welsh","itemName":"Welsh"},{"id":"Zhuang","itemName":"Zhuang"}];
    }

    private subscribeToSaveResponse(result: Observable<CampaignTemplate>) {
        result.subscribe((res: CampaignTemplate) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CampaignTemplate) {
        this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
        this.isSaving = false;
        //    this.router.navigateByUrl(location.href + '(' + 'popup:' + 'campaign-template/' + result.id + '/launch' + ')');
        //    location.href = location.href + '(' + 'popup:' + 'campaign-template/' + result.id + '/launch' + ')';
        // this.router.navigate(['/campaign-template/group/' + this.groupId + '/' + this.groupName], {
        //     queryParams:
        //     {
        //         page: this.page,
        //         size: this.itemsPerPage,
        //         sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        //     }
        // });

        this.activeModal.dismiss(result);

        if (this.isLaunch) {
            setTimeout(() => {
                // const pageLocation: string = decodeURI(encodeURI(location.href) + '(' + 'popup:' + 'campaign-template/' + result.id + '/launch' + ')');
                this.router.navigate(['/', { outlets: { popup: 'campaign-template/'+ result.id + '/launch'} }]);
                // alert(pageLocation);
                // location.href = pageLocation;
                this.isLaunch = false;
            }, 100);

        }

    }

    launch() {
        this.isLaunch = true;
        this.save();
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-campaign-template-popup',
    template: ''
})
export class CampaignTemplatePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private campaignTemplatePopupService: CampaignTemplatePopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.campaignTemplatePopupService
                    .open(CampaignTemplateDialogComponent as Component, params['id']);
            } else {
                this.campaignTemplatePopupService
                    .open(CampaignTemplateDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

@Component({
    selector: 'jhi-ngbd-timepicker-validation',
    template: './campaign-template-dialog.component.html'
})
export class NgbdTimepickerValidationComponent {
    time = { hour: 13, minute: 30 };
    ctrl = new FormControl('', (control: FormControl) => {
        const value = control.value;

        if (!value) {
            return null;
        }

        if (value.hour < 12) {
            return { tooEarly: true };
        }
        if (value.hour > 13) {
            return { tooLate: true };
        }

        return null;
    });
}

export class SimpleTime {
    constructor(
        public hour?: number,
        public minute?: number,
    ) {
    }
}
