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
    CampaignTemplate, CampaignTemplateFilterCriterion, CampaignTemplateContentCriterion, RecurrenceType, FilterOption, CampaignTargetGroupSizeRequest,
    TargetGroupFilterCriterionSizeRequest
} from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

    countries: string[];
    languagesList: string[];
    targetGroupSize: number;
    time: SimpleTime;
    ctrl: any;
    operatingSystems: string[] = ['amazon', 'kindle', 'android', 'ios'];
    optimoveInstances: string[] = ['gvcspain_OPTIMOVE1', 'gvcspain_OPTIMOVE2', 'gvcspain_OPTIMOVE3', 'gvcspain_OPTIMOVE4'];
    isLaunch: boolean;
    currentDate: Date = new Date();

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
        this.targetGroupSize = 0;
        this.campaignTemplateGroupCreationForm = this.fb.group({
            targetGroupFilterCriteria: this.fb.array([]),
            targetGroupContentCriteria: this.fb.array([])
        });
        this.isLaunch = false;
    }

    ngOnInit() {
        this.isSaving = false;
        this.showSendImmDiv = true;
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
        });
        this.campaignTemplateService.getOptimoveInstances().subscribe((data) => {
            this.campaignTemplate.optimoveInstances = data['optimoveInstances'];
        });
        this.createForm();
        this.prepareData();
        this.populateCountries();
        this.populateFilterOptions();
        this.populateEventsMaps();
        this.populateTagsMaps();
        this.populateFiltersMap();
        this.populateLanguagesList();

        const now = new Date();
        this.minDate = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
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
        this.isSaving = true;

        if (this.campaignTemplateGroupCreationForm.value.time) {
            this.campaignTemplateGroupCreationForm.value.scheduledTime = '' +
                (this.campaignTemplateGroupCreationForm.value.time.hour < 10 ? '0' +
                    this.campaignTemplateGroupCreationForm.value.time.hour : this.campaignTemplateGroupCreationForm.value.time.hour) + ':' +
                (this.campaignTemplateGroupCreationForm.value.time.minute < 10 ? '0' +
                    this.campaignTemplateGroupCreationForm.value.time.minute : this.campaignTemplateGroupCreationForm.value.time.minute) + ':00';

        } else {
            this.campaignTemplateGroupCreationForm.value.scheduledTime = '' + this.currentDate.getHours() + ':' + this.currentDate.getMinutes() + ':00';
        }
        if (this.campaignTemplateGroupCreationForm.value.id !== null) {
            this.subscribeToSaveResponse(
                this.campaignTemplateService.update(this.campaignTemplateGroupCreationForm.value));
        } else {
            this.subscribeToSaveResponse(
                this.campaignTemplateService.create(this.campaignTemplateGroupCreationForm.value));
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
        this.targetGroupFilterCriteria.push(this.fb.group(new CampaignTemplateFilterCriterion('', '', '', [])));
    }

    addCampaignTemplateContentCriterion() {
        this.targetGroupContentCriteria.push(this.fb.group(new CampaignTemplateContentCriterion('', '', '', '')));
    }

    createForm() {
        if (!this.campaignTemplate) {
            this.campaignTemplate = new CampaignTemplate();
        }
        const now = new Date();
        const todayDt = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate() + 1
        };
        this.campaignTemplateGroupCreationForm = this.fb.group({
            id: (!this.campaignTemplate.id) ? null : this.campaignTemplate.id,
            frontEnd: (!this.campaignTemplate.frontEnd) ? '' : this.campaignTemplate.frontEnd,
            product: (!this.campaignTemplate.product) ? '' : this.campaignTemplate.product,
            campaignName: (!this.campaignTemplate.campaignName) ? '' : this.campaignTemplate.campaignName,
            status: (!this.campaignTemplate.status) ? 'Draft' : this.campaignTemplate.status,
            campaignDescription: (!this.campaignTemplate.campaignDescription) ? '' : this.campaignTemplate.campaignDescription,
            startDate: (!this.campaignTemplate.startDate) ? todayDt : this.campaignTemplate.startDate,
            sendImmediately: (!this.campaignTemplate.sendImmediately) ? false : this.campaignTemplate.sendImmediately,
            recurrenceType: (!this.campaignTemplate.recurrenceType) ? 'NONE' : this.campaignTemplate.recurrenceType,
            recurrenceEndDate: (!this.campaignTemplate.recurrenceEndDate) ? todayDt : this.campaignTemplate.recurrenceEndDate,
            scheduledTime: (!this.campaignTemplate.scheduledTime) ? '' : this.campaignTemplate.scheduledTime,
            inPlayerTimezone: (!this.campaignTemplate.inPlayerTimezone) ? false : this.campaignTemplate.inPlayerTimezone,
            campaignGroupId: (!this.campaignTemplate.campaignGroupId) ? '' : this.campaignTemplate.campaignGroupId,
            contentName: (!this.campaignTemplate.contentName) ? '' : this.campaignTemplate.contentName,
            contentTitle: (!this.campaignTemplate.contentTitle) ? '' : this.campaignTemplate.contentTitle,
            contentBody: (!this.campaignTemplate.contentBody) ? '' : this.campaignTemplate.contentBody,
            metaData: (!this.campaignTemplate.metaData) ? '' : this.campaignTemplate.metaData,
            targetGroupFilterCriteria: this.fb.array([]),
            targetGroupContentCriteria: this.fb.array([]),
            time: this.fb.control((!this.campaignTemplate.scheduledTime) ? new SimpleTime(this.currentDate.getHours(), this.currentDate.getMinutes()) :
                new SimpleTime(Number(this.campaignTemplate.scheduledTime.substr(0, 2)),
                    Number(this.campaignTemplate.scheduledTime.substr(3, 2))), (control: FormControl) => {
                        const value = control.value;
                        const totalCurrentDayMinutes = this.currentDate.getHours() * 60 + this.currentDate.getMinutes();
                        const minutes = this.currentDate.getMinutes();
                        if (!value) {
                            return null;
                        }
                        if (((value.hour * 60) + value.minute) < totalCurrentDayMinutes) {
                            return { invalid: true };
                        }
                        return null;
                    }),
            languageSelected: (!this.campaignTemplate.languageSelected) ? '' : this.campaignTemplate.languageSelected,
            optimoveInstances: (!this.campaignTemplate.optimoveInstances) ? '' : this.campaignTemplate.optimoveInstances,
        });
        // (<FormControl>this.campaignTemplateGroupCreationForm.controls['recurrenceType']).setValue('NONE');
    }
    get targetGroupFilterCriteria(): FormArray {
        return this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
    };

    get targetGroupContentCriteria(): FormArray {
        return this.campaignTemplateGroupCreationForm.get('targetGroupContentCriteria') as FormArray;
    };

    prepareData() {
        if (this.campaignTemplate.targetGroupFilterCriteria) {
            for (const i of this.campaignTemplate.targetGroupFilterCriteria) {
                if (Array.isArray(i.filterOptionValue)) {
                    const formBuilderGroup = this.fb.group({
                        filterOption: i.filterOption,
                        filterOptionComparison: i.filterOptionComparison,
                        filterOptionLookUp: i.filterOptionLookUp,
                        filterOptionValue: [i.filterOptionValue]
                    });
                    this.targetGroupFilterCriteria.push(formBuilderGroup);
                } else {
                    this.targetGroupFilterCriteria.push(this.fb.group(i));
                }
            }
        }
        if (this.campaignTemplate.targetGroupContentCriteria) {
            for (const i of this.campaignTemplate.targetGroupContentCriteria) {
                this.targetGroupContentCriteria.push(this.fb.group(i));
            }
        } else {
            this.targetGroupContentCriteria.push(this.fb.group({
                contentName: '',
                contentTitle: '',
                contentBody: '',
                languageSelected: ''
            }));
        }
    }
    populateLanguagesList() {
        this.languagesList = LANGUAGES;
    }
    sendImmediatelyCheck() {
        const now = new Date();
        const todayDt1 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        const todayDt2 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate() + 1
        };
        const isSendImmedChecked = this.campaignTemplateGroupCreationForm.controls['sendImmediately'].value;
        if (isSendImmedChecked) {
            this.showSendImmDiv = false;
            this.campaignTemplateGroupCreationForm.controls['startDate'].setValue(todayDt1);
            this.campaignTemplateGroupCreationForm.controls['recurrenceType'].setValue('NONE');
            this.campaignTemplateGroupCreationForm.controls['recurrenceEndDate'].setValue(todayDt1);
        } else {
            this.showSendImmDiv = true;
            this.campaignTemplateGroupCreationForm.controls['startDate'].setValue(todayDt2);
            this.campaignTemplateGroupCreationForm.controls['recurrenceType'].setValue('NONE');
            this.campaignTemplateGroupCreationForm.controls['recurrenceEndDate'].setValue(todayDt2);
        }
    }

    pushOptimoveInstances() {
        if (this.campaignTemplate.id) {
            const body = {
                'templateId': this.campaignTemplate.id,
                'optimoveInstances': this.campaignTemplateGroupCreationForm.controls['optimoveInstances'].value
            }

            this.campaignTemplateService.pushOptimoveInstances(body).subscribe(
                (res: ResponseWrapper) => {
                    alert(res);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        } else {
            console.log('templateId is null..');
        }
    }

    getTargetGroupSize() {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        let formLengthIterator = 0;
        const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        while (formLengthIterator < targetGroupFilters.length) {
            const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
            const optionValues: string[] = [];
            if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
                for (const optionValue of targetGroupFilter.get('filterOptionValue').value) {
                    optionValues.push(optionValue);
                }
            } else {
                optionValues.push(targetGroupFilter.get('filterOptionValue').value);
            }
            targetGroupFilterCriteria.push(new TargetGroupFilterCriterionSizeRequest(targetGroupFilter.get('filterOption').value,
                targetGroupFilter.get('filterOptionLookUp').value,
                targetGroupFilter.get('filterOptionComparison').value,
                optionValues));
            formLengthIterator = formLengthIterator + 1;
        }

        const body = new CampaignTargetGroupSizeRequest(
            this.campaignTemplateGroupCreationForm.get('frontEnd').value,
            this.campaignTemplateGroupCreationForm.get('product').value,
            targetGroupFilterCriteria);

        this.campaignTemplateService.getTargetGroupSize(body).subscribe(
            (res: ResponseWrapper) => this.onTargetGroupSizeRequestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
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
    onFilterOptionChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionLookUp').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionComparison').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
    }
    onFilterOptionLookupChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionComparison').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
    }
    populateFilterOptions() {
        this.filterOptions = ['App', 'App Version', 'Country', 'Event', 'Install Date', 'Language', 'Last Open Date', 'OS', 'Segment', 'Tag', 'Timezone'];
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
        filterOptionLookUpComparisonVsValue.set('equals', ['sessionBalance']);
        filterOptionLookUpComparisonVsValue.set('not equals', ['sessionBalance']);
        filterOptionLookUpComparisonVsValue.set('less than', ['sessionBalance']);
        filterOptionLookUpComparisonVsValue.set('greater than', ['sessionBalance']);
        filterOptionLookUpComparisonVsValue.set('exists', ['sessionBalance']);
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
                    if (formControlType === 'dropdown') {
                        return 'multiSelectDropdown';
                    } else {
                        return formControlType;
                    }
                }
                default: {
                    return this.getFormControlTypeFromFilterOptionValues(this.filtersMap.get(filterOption).get(filterOptionComparison));
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
            }
        } else {
            return 'dropdown';
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

    populateLanguageParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', LANGUAGES.sort());
        filterComparisonVsValue.set('is not', LANGUAGES.sort());
        this.filtersMap.set('Language', filterComparisonVsValue);
    }

    populateCountryParams() {
        const filterComparisonVsValue: Map<string, string[]> = new Map<string, string[]>();
        filterComparisonVsValue.set('is', this.countries);
        filterComparisonVsValue.set('is not', this.countries);
        this.filtersMap.set('Country', filterComparisonVsValue);
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
    populateCountries() {
        this.countries = ['Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica',
            'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
            'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Virgin Islands',
            'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands',
            'Central African Republic', 'Chad', 'Chile', 'China', 'Hong Kong, SAR China', 'Macao, SAR China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia',
            'Comoros', 'Congo (Brazzaville)', 'Congo, (Kinshasa)', 'Cook Islands', 'Costa Rica', 'Côte d\'Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
            'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
            'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon',
            'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau',
            'Guyana', 'Haiti', 'Heard and Mcdonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of',
            'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (North)',
            'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Lao PDR', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
            'Macedonia, Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte',
            'Mexico', 'Micronesia, Federated States of', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
            'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands',
            'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal',
            'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint-Barthélemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia',
            'Saint-Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
            'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
            'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen Islands', 'Swaziland',
            'Sweden', 'Switzerland', 'Syrian Arab Republic (Syria)', 'Taiwan, Republic of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste',
            'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine',
            'United Arab Emirates', 'United Kingdom', 'United States of America', 'US Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu',
            'Venezuela (Bolivarian Republic)', 'Viet Nam', 'Virgin Islands, US', 'Wallis and Futuna Islands', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];
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
                const pageLocation: string = decodeURI(encodeURI(location.href) + '(' + 'popup:' + 'campaign-template/' + result.id + '/launch' + ')');
                // alert(pageLocation);
                location.href = pageLocation;
                this.isLaunch = false;
            }, 100);

        }
        // this.router.navigate([location.href + '(' + 'popup:' + 'campaign-template/' + result.id + '/launch' + ')']);

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
