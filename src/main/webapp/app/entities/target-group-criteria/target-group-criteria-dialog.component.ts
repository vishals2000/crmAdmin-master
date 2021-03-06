import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TargetGroupCriteria } from './target-group-criteria.model';
import { TargetGroupFilterCriterion, CampaignTargetGroupSizeRequest, TargetGroupFilterCriterionSizeRequest} from './target-group-criteria.model';
import { TargetGroupCriteriaPopupService } from './target-group-criteria-popup.service';
import { TargetGroupCriteriaService } from './target-group-criteria.service';

import { ResponseWrapper, LANGUAGES, TIME_ZONES } from '../../shared';
import { FeProductService } from '../fe-product/fe-product.service';
import { FeProduct } from '../fe-product/fe-product.model';

import { FormArray, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { FilterCriteriaService } from '../filter-criteria/filter-criteria.service'
import { EventCriteriaService } from '../event-criteria/event-criteria.service'
import { TagCriteriaService } from '../tag-criteria/tag-criteria.service'

import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-target-group-criteria-dialog',
    templateUrl: './target-group-criteria-dialog.component.html'
})
export class TargetGroupCriteriaDialogComponent implements OnInit, OnChanges {
    // @Input() targetGroupCriteria: TargetGroupCriteria;
    targetGroupCreationForm: FormGroup;
    targetGroupCriteria: TargetGroupCriteria;
    isSaving: boolean;
    predicate: any;
    reverse: any;
    products: string[];
    frontEnds: string[];
    frontEndOrProductInvalid: boolean;
    targetGroupSize: number;

    filterOptions: string[];
    filtersMap: Map<string, Map<string, string[]>>;
    appVersionMap: Map<string, string[]>;

    sportsEventsMap: Map<string, Map<string, string>>;
    pokerEventsMap: Map<string, Map<string, string>>;
    casinoEventsMap: Map<string, Map<string, string>>;

    sportsTagsMap: Map<string, Map<string, string[]>>;
    pokerTagsMap: Map<string, Map<string, string[]>>;
    casinoTagsMap: Map<string, Map<string, string[]>>;

    tagsMap: Map<string, Map<string, string[]>>;
    countries: string[];
    operatingSystems: string[] = ['amazon', 'kindle', 'android'];
    startDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private targetGroupCriteriaService: TargetGroupCriteriaService,
        private eventManager: JhiEventManager,
        private feProductService: FeProductService,
        private fb: FormBuilder,
        private filterCriteriaService: FilterCriteriaService,
        private eventCriteriaService: EventCriteriaService,
        private tagCriteriaService: TagCriteriaService,
        private http: HttpClient
    ) {
        this.products = [];
        this.frontEnds = [];
        this.filtersMap = new Map<string, Map<string, string[]>>();
        this.sportsEventsMap = new Map<string, Map<string, string>>();
        this.pokerEventsMap = new Map<string, Map<string, string>>();
        this.casinoEventsMap = new Map<string, Map<string, string>>();

        this.sportsTagsMap = new Map<string, Map<string, string[]>>();
        this.pokerTagsMap = new Map<string, Map<string, string[]>>();
        this.casinoTagsMap = new Map<string, Map<string, string[]>>();

        this.appVersionMap = new Map<string, string[]>();
        this.countries = [];
        this.filterOptions = [];
        this.targetGroupSize = 0;
        this.startDateDp = new Date();
    }

    ngOnInit() {
        this.isSaving = false;
        this.frontEndOrProductInvalid = true;
        this.createForm();
        this.populateFrontEnds();
        this.populateCountries();
        this.populateFilterOptions();
        this.populateEventsMaps();
        this.populateTagsMaps();
    }

    getFormControlType(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl  = targetGroupFilters.at(index);
        const filterOption: string = targetGroupFilterCriterionFormControl.get('filterOption').value;
        const filterOptionLookUp: string = targetGroupFilterCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparison: string = targetGroupFilterCriterionFormControl.get('filterOptionComparison').value;
        if (filterOption && filterOptionComparison) {
            switch (filterOption) {
                case 'Tag' : {
                    const productSelected: string = this.targetGroupCreationForm.get('product').value;
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
                    const productSelected: string = this.targetGroupCreationForm.get('product').value;
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
                    if ( formControlType === 'dropdown') {
                        return 'multiSelectDropdown';
                    } else {
                        return formControlType;
                    }
                }
                default : {
                    return this.getFormControlTypeFromFilterOptionValues(this.filtersMap.get(filterOption).get(filterOptionComparison));
                }
            }
        } else {
            return 'textbox';
        }
        return 'textbox';
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

    getFilterOptionValueValues(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const filterOptionSelected: string = targetGroupCriterionFormControl.get('filterOption').value;
        const filterOptionLookUpSelected: string = targetGroupCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparisonSelected: string = targetGroupCriterionFormControl.get('filterOptionComparison').value;
        const productSelected: string = this.targetGroupCreationForm.get('product').value;

        const optionValues: string[] = [];
        if (filterOptionSelected && filterOptionSelected !== '' &&
                filterOptionComparisonSelected && filterOptionComparisonSelected !== '') {
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

    getFilterOptionComparisonValues(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
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
                    switch (this.targetGroupCreationForm.get('product').value) {
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
                    switch (this.targetGroupCreationForm.get('product').value) {
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

    getFilterOptionLookUpValues(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupCriterionFormControl: AbstractControl = targetGroupFilters.at(index);
        const targetGroupFiltersFilterOptionValues = targetGroupCriterionFormControl.get('filterOption').value;
        const lookupValues: string[] = [];
        if (targetGroupFiltersFilterOptionValues && targetGroupFiltersFilterOptionValues !== '') {
            switch (this.targetGroupCreationForm.get('product').value) {
                case 'SPORTS' : {
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event' : {
                                this.sportsEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag' : {
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
                case 'POKER' : {
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event' : {
                                this.pokerEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag' : {
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
                case 'CASINO' : {
                    if (targetGroupCriterionFormControl.get('filterOption').value) {
                        switch (targetGroupCriterionFormControl.get('filterOption').value) {
                            case 'Event' : {
                                this.casinoEventsMap.forEach((value: Map<string, string>, key: string) => {
                                    lookupValues.push(key);
                                });
                                lookupValues.sort();
                                return lookupValues;
                            }
                            case 'Tag' : {
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
                default : return [''];
            }
        } else {
            return [''];
        }
    }

    isOptionLookUpHidden(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl  = targetGroupFilters.at(index);
        switch (targetGroupFilterCriterionFormControl.get('filterOption').value) {
            case 'Tag' :
            case 'Event' : { return false;
            }
            default : return true;
        }
    }

    isOptionValueSelectionHidden(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl  = targetGroupFilters.at(index);
        const filterOption: string = targetGroupFilterCriterionFormControl.get('filterOption').value;
        const filterOptionLookUp: string = targetGroupFilterCriterionFormControl.get('filterOptionLookUp').value;
        const filterOptionComparison: string = targetGroupFilterCriterionFormControl.get('filterOptionComparison').value;
        if (filterOption) {
            switch (filterOption) {
                case 'Tag' :
                case 'Event' : { return !filterOptionLookUp || filterOptionLookUp === '' || !filterOptionComparison || filterOptionComparison === '';
                }
                default : return false;
            }
        }
        return false;
    }

    onFilterOptionChange(index) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        const targetGroupFilterCriterionFormControl: AbstractControl  = targetGroupFilters.at(index);
        targetGroupFilterCriterionFormControl.get('filterOptionLookUp'). setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionComparison').setValue('');
        targetGroupFilterCriterionFormControl.get('filterOptionValue').setValue('');
    }

    // getFilterOptionValueValues(index) {
    //     const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
    //     const targetGroupFiltersFilterOptionValue = targetGroupFilters.at(index).get('filterOption').value;
    //     const targetGroupFiltersFilterOptionComparisonValue = targetGroupFilters.at(index).get('filterOptionComparison').value;
    //     const lookupValues: string[] = [];
    //     if (targetGroupFiltersFilterOptionValue && targetGroupFiltersFilterOptionComparisonValue) {
    //         this.filtersMap.get(targetGroupFiltersFilterOptionValue).get(targetGroupFiltersFilterOptionComparisonValue).forEach((value: string) => {
    //             lookupValues.push(value);
    //         });
    //         return lookupValues;
    //     } else {
    //         return [''];
    //     }
    // }

    createForm() {
        this.targetGroupCreationForm = this.fb.group({
            frontEnd: '',
            product: '',
            name: '',
            targetGroupFilterCriteria: this.fb.array([])
        });
    }

    onProductChange() {
        this.onfrontEndOrProductChange();
    }

    onfrontEndOrProductChange() {
        this.frontEndOrProductInvalid = this.isEmpty(this.targetGroupCreationForm.value.frontEnd) || this.isEmpty(this.targetGroupCreationForm.value.product);
        if (!this.frontEndOrProductInvalid) {
            // this.populateFilterOptions();
            this.populateFiltersMap();
            // this.populateEventsMap();
            // this.populateTagsMap();
        }
    }

    isEmpty(val: string) {
        return (!val || 0 === val.length);
    }

    ngOnChanges() {
        this.targetGroupCreationForm.reset({
          name: this.targetGroupCriteria.name,
          frontEnd: this.targetGroupCriteria.frontEnd,
          product: this.targetGroupCriteria.product
        });
        this.setTargetGroupFilterCriteria(this.targetGroupCriteria.targetGroupFilterCriteria);
    }

    get targetGroupFilterCriteria(): FormArray {
        return this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
    };

    setTargetGroupFilterCriteria(targetGroupFilterCriteria: TargetGroupFilterCriterion[]) {
        const targetGroupFilterCriteriaFGs = targetGroupFilterCriteria.map((targetGroupFilterCriterion) => this.fb.group(targetGroupFilterCriterion));
        const targetGroupFilterCriteriaFormArray = this.fb.array(targetGroupFilterCriteriaFGs);
        this.targetGroupCreationForm.setControl('targetGroupFilterCriteria', targetGroupFilterCriteriaFormArray);
    }

    addTargetGroupFilterCriterion() {
        this.targetGroupFilterCriteria.push(this.fb.group(new TargetGroupFilterCriterion('', '', '', [])));
    }

    removeTargetGroupFilterCriterion(i) {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        targetGroupFilters.removeAt(i);
    }

    populateFeProducts() {
        this.products = [];
        this.feProductService.queryProductsForFrontEnd({
            frontEnd: this.targetGroupCreationForm.get('frontEnd').value,
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onFeProductSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    isFormInvalid() {
        return this.targetGroupCreationForm.invalid || this.targetGroupFilterCriteria.length === 0 || this.isSaving;
    }

    populateFrontEnds() {
        this.frontEnds = [];
        this.feProductService.queryDistinctFe({
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onFeFrontEndSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
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

    populateFilterOptions() {
        this.filterOptions = ['App', 'App Version', 'Country', 'Event', 'Install Date', 'Language', 'Last Open Date', 'OS', 'Segment', 'Tag', 'Timezone'];
        this.filterOptions.sort();
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
        filterOptionLookUpComparisonVsValue.set('equals' , ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('not equals' , ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('less than' , ['stake amount']);
        filterOptionLookUpComparisonVsValue.set('greater than' , ['stake amount']);
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
        comparisonValues = [ 'opened in the last 2 days', 'opened in the last 2 weeks', 'opened in the last month' ];
        filterComparisonVsValue.set('was', comparisonValues);
        comparisonValues = [ 'opened in the last 2 days', 'opened in the last 2 weeks', 'opened in the last month' ];
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

    populateTagsMap() {
        this.tagCriteriaService.queryTags({
            frontEnd: this.targetGroupCreationForm.value.frontEnd,
            product: this.targetGroupCreationForm.value.product,
            page: 0,
            size: 500,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onPopulateTagsMapSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    getFilterOptions(index) {
        const filterOptions: string[] = [];
        this.filtersMap.forEach((value: Map<string, string[]>, key: string) => {
            filterOptions.push(key);
        });
        filterOptions.push('Event');
        filterOptions.push('Tag');
        filterOptions.sort();
        return filterOptions;
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        // if (this.targetGroupCriteria.id !== undefined) {
        if (this.targetGroupCreationForm.value.id !== undefined) {
            this.logUpdating(this.targetGroupCreationForm.value);
            this.subscribeToSaveResponse(this.targetGroupCriteriaService.update(this.targetGroupCreationForm.value));
        } else {
            this.logSaving(this.targetGroupCreationForm.value);
            this.subscribeToSaveResponse(this.targetGroupCriteriaService.create(this.targetGroupCreationForm.value));
        }
    }

    private logUpdating(targetGroupCriteria: TargetGroupCriteria) {
        const copy: TargetGroupCriteria = Object.assign({}, targetGroupCriteria);
        // console.log('updating ' + copy);
        // console.log(copy);
        // return copy;
    }

    private logSaving(targetGroupCriteria: TargetGroupCriteria) {
        const copy: TargetGroupCriteria = Object.assign({}, targetGroupCriteria);
        // console.log('saving ' + copy);
        // console.log(copy);
        // return copy;
    }

    prepareSaveTargetGroupCriteria(): TargetGroupCriteria {
        const formModel = this.targetGroupCreationForm.value;

        // deep copy of form model lairs
        const targetGroupFilterCriteriaDeepCopy: TargetGroupFilterCriterion[] = formModel.targetGroupFilterCriteria.map(
          (targetGroupFilterCriterion: TargetGroupFilterCriterion) => Object.assign({}, targetGroupFilterCriterion)
        );

        // return new `TargetGroupCriteria` object containing a combination of original targetGroupCriteria value(s)
        // and deep copies of changed form model values
        const saveTargetGroupCriteria: TargetGroupCriteria = {
          id: this.targetGroupCriteria.id,
          name: formModel.name as string,
          frontEnd: formModel.frontEnd as string,
          product: formModel.product as string,
          // targetGroupFilterCriteria: formModel.targetGroupFilterCriteria // <-- bad!
          targetGroupFilterCriteria: targetGroupFilterCriteriaDeepCopy
        };
        return saveTargetGroupCriteria;
    }

    private onFeProductSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.products.push(data[i].product);
        }
    }

    private onFeFrontEndSuccess(data, headers) {
        for (let i = 0; i < data.length; i++) {
            this.frontEnds.push(data[i]);
        }
    }

    private onPopulateTagsMapSuccess(data, headers) {
        this.tagsMap = data;
    }

    private subscribeToSaveResponse(result: Observable<TargetGroupCriteria>) {
        result.subscribe((res: TargetGroupCriteria) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: TargetGroupCriteria) {
        this.eventManager.broadcast({ name: 'targetGroupCriteriaListModification', content: 'OK'});
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
        console.log('Sharath error is ' + error);
        this.alertService.error(error.message, null, null);
    }

    getTargetGroupSize() {
        const targetGroupFilters = this.targetGroupCreationForm.get('targetGroupFilterCriteria') as FormArray;
        let formLengthIterator = 0;
        const targetGroupFilterCriteria: TargetGroupFilterCriterionSizeRequest[] = [];
        while (formLengthIterator < targetGroupFilters.length) {
            const targetGroupFilter = targetGroupFilters.at(formLengthIterator);
            const optionValues: string[] = [];
            if (Array.isArray(targetGroupFilter.get('filterOptionValue').value)) {
                for (const optionValue of targetGroupFilter.get('filterOptionValue').value){
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
            this.targetGroupCreationForm.get('frontEnd').value,
            this.targetGroupCreationForm.get('product').value,
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
}

@Component({
    selector: 'jhi-target-group-criteria-popup',
    template: ''
})
export class TargetGroupCriteriaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private targetGroupCriteriaPopupService: TargetGroupCriteriaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.targetGroupCriteriaPopupService
                    .open(TargetGroupCriteriaDialogComponent as Component, params['id']);
            } else {
                this.targetGroupCriteriaPopupService
                    .open(TargetGroupCriteriaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
