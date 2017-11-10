import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ResponseWrapper, LANGUAGES, TIME_ZONES } from '../../shared';
import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import {
CampaignTemplate, CampaignTemplateFilterCriterion, RecurrenceType, FilterOption, CampaignTargetGroupSizeRequest,
TargetGroupFilterCriterionSizeRequest
} from './campaign-template.model';
import { CampaignTemplatePopupService } from './campaign-template-popup.service';
import { CampaignTemplateService } from './campaign-template.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'jhi-campaign-template-dialog',
    templateUrl: './campaign-template-dialog.component.html'
})
export class CampaignTemplateDialogComponent implements OnInit {

    campaignTemplate: CampaignTemplate;
    isSaving: boolean;
    startDateDp: any;
    recurrenceEndDateDp: any;
    campaignTemplateGroupCreationForm: FormGroup;
    filterOptions: string[];
    filtersMap: Map<string, Map<string, string[]>>;
    appVersionMap: Map<string, string[]>;
    sportsEventsMap: Map<string, Map<string, string>>;
    pokerEventsMap: Map<string, Map<string, string>>;
    casinoEventsMap: Map<string, Map<string, string>>;

    sportsTagsMap: Map<string, Map<string, string[]>>;
    pokerTagsMap: Map<string, Map<string, string[]>>;
    casinoTagsMap: Map<string, Map<string, string[]>>;

    countries: string[];
    languagesList: string[];
    targetGroupSize: number;
    time: SimpleTime;
    operatingSystems: string[] = ['amazon', 'kindle', 'android'];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private campaignTemplateService: CampaignTemplateService,
        private eventManager: JhiEventManager,
        private fb: FormBuilder,
        private http: HttpClient
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
    }

    ngOnInit() {
        this.isSaving = false;               
        this.campaignTemplateService.currentMesage.subscribe((message) => {
            this.campaignTemplate.campaignGroupId = message[0];
            this.campaignTemplate.frontEnd = message[1];
            this.campaignTemplate.product = message[2];
        });        
        this.createForm();
        this.prepareData();
        this.populateCountries();
        this.populateFilterOptions();
        this.populateEventsMaps();
        this.populateTagsMaps();
        this.populateFiltersMap();
        this.populateLanguagesList();

        if (this.campaignTemplate && this.campaignTemplate.scheduledTime && this.campaignTemplate.scheduledTime.substr(0, 2) && this.campaignTemplate.scheduledTime.substr(3, 2)) {
            this.time = new SimpleTime(Number(this.campaignTemplate.scheduledTime.substr(0, 2)), Number(this.campaignTemplate.scheduledTime.substr(3, 2)));
        } else {
            this.time = new SimpleTime(11, 0);
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this.campaignTemplateGroupCreationForm.value.scheduledTime = '' + (this.time.hour < 10 ? '0' + this.time.hour : this.time.hour) + ':' +
        (this.time.minute < 10 ? '0' + this.time.minute : this.time.minute);

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

    createForm() {
        if(!this.campaignTemplate) {
            this.campaignTemplate = new CampaignTemplate();
        }
        this.campaignTemplateGroupCreationForm = this.fb.group({
            id: (!this.campaignTemplate.id) ? null : this.campaignTemplate.id,
            frontEnd: (!this.campaignTemplate.frontEnd) ? '' : this.campaignTemplate.frontEnd,
            product: (!this.campaignTemplate.product) ? '' : this.campaignTemplate.product,
            campaignName: (!this.campaignTemplate.campaignName) ? '' : this.campaignTemplate.campaignName,
            campaignDescription: (!this.campaignTemplate.campaignDescription) ? '' : this.campaignTemplate.campaignDescription,
            startDate: (!this.campaignTemplate.startDate) ? '' : this.campaignTemplate.startDate,
            recurrenceType: (!this.campaignTemplate.recurrenceType) ? '' : this.campaignTemplate.recurrenceType,
            recurrenceEndDate: (!this.campaignTemplate.recurrenceEndDate) ? '' : this.campaignTemplate.recurrenceEndDate,
            scheduledTime: (!this.campaignTemplate.scheduledTime) ? '' : this.campaignTemplate.scheduledTime,
            inPlayerTimezone: (!this.campaignTemplate.inPlayerTimezone) ? false : this.campaignTemplate.inPlayerTimezone,
            campaignGroupId: (!this.campaignTemplate.campaignGroupId) ? '' : this.campaignTemplate.campaignGroupId,
            // filterOption: 0,
            // filterOptionComparison: 0,
            // filterOptionValue: '',
            contentName: (!this.campaignTemplate.contentName) ? '' : this.campaignTemplate.contentName,
            contentTitle: (!this.campaignTemplate.contentTitle) ? '' : this.campaignTemplate.contentTitle,
            contentBody: (!this.campaignTemplate.contentBody) ? '' : this.campaignTemplate.contentBody,
            metaData: (!this.campaignTemplate.metaData) ? '' : this.campaignTemplate.metaData,
            languageComparision: (!this.campaignTemplate.languageComparision) ? '' : this.campaignTemplate.languageComparision,
            // targetGroupFilterCriteria: (!this.campaignTemplate.targetGroupFilterCriteria) ? this.fb.array([]) : this.prepareData(),
            targetGroupFilterCriteria: this.fb.array([]),
            time: '',
            languageSelected: (!this.campaignTemplate.languageSelected) ? '' : this.campaignTemplate.languageSelected,
        });
    // (<FormControl>this.campaignTemplateGroupCreationForm.controls['recurrenceType']).setValue('NONE');
    }
    get targetGroupFilterCriteria(): FormArray {
        return this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
    };

    prepareData() {
        if(this.campaignTemplate.targetGroupFilterCriteria) {
            // const targetGroupFilterCriteriaDeepCopy: CampaignTemplateFilterCriterion[] = this.campaignTemplate.targetGroupFilterCriteria.map(
            //     (c: CampaignTemplateFilterCriterion) => Object.assign({}, c)
            // );
            
            // public filterOption: string,
            // public filterOptionLookUp: string,
            // public filterOptionComparison: string,
            // public filterOptionValue: string[]
            // this.targetGroupFilterCriteria.push(this.fb.group(new CampaignTemplateFilterCriterion(i.filterOption, 
                // i.filterOptionLookUp, i.filterOptionComparison,i.filterOptionValue)));

            for (let i of this.campaignTemplate.targetGroupFilterCriteria) {
                // this.targetGroupFilterCriteria.push(this.fb.group(i));
                this.targetGroupFilterCriteria.push(this.fb.group(new CampaignTemplateFilterCriterion(i.filterOption, 
                    i.filterOptionLookUp, i.filterOptionComparison,i.filterOptionValue)));
            }
        }    
    }
    populateLanguagesList() {
        this.languagesList = LANGUAGES;
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
        const req = this.http.post('http://trdev-player-metrics-collector-api-container.ivycomptech.co.in/api/rest/mcsgateway/v1/getTargetGroupSize', body, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        })
        req.subscribe(
            (res: ResponseWrapper) => this.onTargetGroupSizeRequestSuccess(res, res),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private onTargetGroupSizeRequestSuccess(data, headers) {
        // console.log(data);
        if (data) {
            this.targetGroupSize = data;
        } else {
            this.targetGroupSize = 0;
        }
    }

    removeTargetGroupFilterCriterion(i) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        targetGroupFilters.removeAt(i);
    }
    onFilterOptionChange(index) {
        const targetGroupFilters = this.campaignTemplateGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionLookUp').setValue('');
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
        if (formOptionValues.length === 1) {
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
        this.countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
            'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana',
            'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Myanmar/Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands',
            'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
            'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominican Republic', 'Dominica', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
            'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'French Guiana', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Great Britain', 'Greece',
            'Grenada', 'Guadeloupe', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
            'Israel and the Occupied Territories', 'Italy', 'Ivory Coast (Cote d\'Ivoire)', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait',
            'Kyrgyz Republic (Kyrgyzstan)', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Republic of Macedonia',
            'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova, Republic of', 'Monaco',
            'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
            'Korea, Democratic Republic of (North Korea)', 'Norway', 'Oman', 'Pacific Islands', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
            'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
            'Saint Vincent\'s & Grenadines', 'Samoa', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
            'Slovak Republic (Slovakia)', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Korea, Republic of (South Korea)', 'South Sudan', 'Spain',
            'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor Leste', 'Togo',
            'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos Islands', 'Uganda', 'Ukraine', 'United Arab Emirates',
            'United States of America (USA)', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (UK)', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
    }

    private subscribeToSaveResponse(result: Observable<CampaignTemplate>) {
        result.subscribe((res: CampaignTemplate) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CampaignTemplate) {
        this.eventManager.broadcast({ name: 'campaignTemplateListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
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
    selector: 'jhi-ngbd-timepicker-basic',
    template: `<ngb-timepicker [(ngModel)]="time"></ngb-timepicker>`
})
export class NgbdTimepickerBasicComponent {
    time = { hour: 13, minute: 30 };
}

export class SimpleTime {
    constructor(
        public hour?: number,
        public minute?: number,
    ) {
    }
}
