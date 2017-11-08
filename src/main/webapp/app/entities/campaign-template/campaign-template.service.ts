import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { CampaignTemplate, CampaignTemplateFilterCriterion } from './campaign-template.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CampaignTemplateService {

    private resourceUrl = 'api/campaign-templates';

    private messageSource = new BehaviorSubject<string>('default messgae');
    cuttentMesage = this.messageSource.asObservable();
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(campaignTemplate: CampaignTemplate): Observable<CampaignTemplate> {
        const copy = this.convert(campaignTemplate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    changeMessage(message: string) {
        this.messageSource.next(message);
    }

    update(campaignTemplate: CampaignTemplate): Observable<CampaignTemplate> {
        const copy = this.convert(campaignTemplate);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: string): Observable<CampaignTemplate> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    findCampGroups(id: string, group: string): Observable<CampaignTemplate[]> {
        return this.http.get(`${this.resourceUrl}/${group}/${id}`).map((res: Response) => {
            return res.json();
        }
    );
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    getPushNotificationCampaignTemplate(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get('api/campaign-templates-push-notification' + `/${req.campaignTemplateId}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.startDate = this.dateUtils
            .convertLocalDateFromServer(entity.startDate);
        entity.recurrenceEndDate = this.dateUtils
            .convertLocalDateFromServer(entity.recurrenceEndDate);
    }

    private convert(campaignTemplate: CampaignTemplate): CampaignTemplate {

        const copy: CampaignTemplate = Object.assign({}, campaignTemplate);
        const campaignTemplateCopy: CampaignTemplate = new CampaignTemplate();
        campaignTemplateCopy.frontEnd = campaignTemplate.frontEnd;
        campaignTemplateCopy.product = campaignTemplate.product;
        campaignTemplateCopy.id = campaignTemplate.id;
        campaignTemplateCopy.name = campaignTemplate.name;
        campaignTemplateCopy.campaignName = campaignTemplate.campaignName;
        campaignTemplateCopy.campaignDescription = campaignTemplate.campaignDescription;
        campaignTemplateCopy.startDate = campaignTemplate.startDate;
        campaignTemplateCopy.recurrenceType = campaignTemplate.recurrenceType;
        campaignTemplateCopy.recurrenceEndDate = campaignTemplate.recurrenceEndDate;
        campaignTemplateCopy.inPlayerTimezone = campaignTemplate.inPlayerTimezone;
        campaignTemplateCopy.scheduledTime = campaignTemplate.scheduledTime;
        campaignTemplateCopy.contentName = campaignTemplate.contentName;
        campaignTemplateCopy.contentTitle = campaignTemplate.contentTitle;
        campaignTemplateCopy.contentBody = campaignTemplate.contentBody;
        campaignTemplateCopy.metaData = campaignTemplate.metaData;
        campaignTemplateCopy.languageComparision = campaignTemplate.languageComparision;
        campaignTemplateCopy.languageSelected = campaignTemplate.languageSelected;

        const campaignTemplateFilterCriteria: CampaignTemplateFilterCriterion[] = [];
        for (const campaignTemplateFilterCriterion of campaignTemplate.targetGroupFilterCriteria) {
            if (Array.isArray(campaignTemplateFilterCriterion.filterOptionValue)) {
                campaignTemplateFilterCriteria.push(new CampaignTemplateFilterCriterion(campaignTemplateFilterCriterion.filterOption,
                    campaignTemplateFilterCriterion.filterOptionLookUp,
                    campaignTemplateFilterCriterion.filterOptionComparison,
                    campaignTemplateFilterCriterion.filterOptionValue));
            } else {
                const optionValues: string[] = [];
                optionValues.push(campaignTemplateFilterCriterion.filterOptionValue);
                campaignTemplateFilterCriteria.push(new CampaignTemplateFilterCriterion(campaignTemplateFilterCriterion.filterOption,
                    campaignTemplateFilterCriterion.filterOptionLookUp,
                    campaignTemplateFilterCriterion.filterOptionComparison,
                    optionValues));
            }
        }
        campaignTemplateCopy.targetGroupFilterCriteria = campaignTemplateFilterCriteria;
        return campaignTemplateCopy;
    }
}
