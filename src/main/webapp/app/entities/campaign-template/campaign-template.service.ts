import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { CampaignTemplate, CampaignTemplateFilterCriterion, CampaignTemplateContentCriterion } from './campaign-template.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CampaignTemplateService {

    private resourceUrl = 'api/campaign-templates';
    private messageSource = new BehaviorSubject<string[]>([]);
    currentMesage = this.messageSource.asObservable();
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(campaignTemplate: CampaignTemplate): Observable<CampaignTemplate> {
        const copy = this.convert(campaignTemplate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    changeMessage(message: string[]) {
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

    getTargetGroupSize(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/getTargetGroupSize', body).map((res: Response) => {
            return res.json();
        });
    }

    getTargetContentGroupSize(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/getTargetContentGroupSize', body).map((res: Response) => {
            return res.json();
        });
    }

    pushNotificationCampaign(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/pushNotificationCampaign', body).map((res: Response) => {
            return res.json();
        });
    }

    cancelPushNotification(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/cancelPushNotificationCampaign', body).map((res: Response) => {
            return res.json();
        });
    }
    
        deletePushNotificationCampaign(body: any): Observable<ResponseWrapper> {
            return this.http.post(this.resourceUrl + '/deletePushNotificationCampaign', body).map((res: Response) => {
                return res;
            });
        }
    
    sendPushNotificationForScreenName(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/sendPushNotificationForScreenName', body).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<CampaignTemplate> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    getFeProduct(id: string, name: string): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${name}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    getOptimoveInstances(): Observable<Response> {
        return this.http.get(this.resourceUrl + '/getOptimoveInstances').map((res: Response) => {
            return res.json();
        });
    }

    // pushOptimoveInstances(copy: any): Observable<Response> {
    //     return this.http.post(this.resourceUrl + '/addChanneltemplate', copy).map((res: Response) => {
    //         return res.json();
    //     });
    // }

    findCampGroups(id: string, group: string): Observable<CampaignTemplate[]> {
        return this.http.get(`${this.resourceUrl}/${group}/${id}`).map((res: Response) => {
            return res.json();
        }
        );
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + '/group/' + req.campGroupId, options)
            .map((res: Response) => this.convertResponse(res));
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + '/group/' + req.campGroupId + '/search/' + req.searchVal)
            .map((res: Response) => this.convertResponse(res));
    }

    getPushNotificationCampaignTemplate(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(`${this.resourceUrl}/${req.campaignTemplateId}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    updateLaunchStatus(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.put(`${this.resourceUrl}/${req.method}/${req.campaignTemplateId}/${req.status}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    updateCancelStatus(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.put(`${this.resourceUrl}/${req.method}/${req.campaignTemplateId}/${req.status}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    updateDeleteStatus(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.put(`${this.resourceUrl}/${req.method}/${req.campaignTemplateId}/${req.status}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    getAppCapGrpIdFromTemp(id: string): Observable<Response> {
        return this.http.get(this.resourceUrl + '/appCampaignGroupInfoWithCampaignTemplateId/' + id).map((res: Response) => {
            return res.json();
        });
    }

    getAppCapGrpIdFromCapGrp(id: string): Observable<Response> {
        return this.http.get(this.resourceUrl + '/appCampaignGroupInfoWithCampaignGroupId/' + id).map((res: Response) => {
            return res.json();
        });
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
        campaignTemplateCopy.campaignGroupId = campaignTemplate.campaignGroupId;
        campaignTemplateCopy.campaignName = campaignTemplate.campaignName;
        campaignTemplateCopy.status = campaignTemplate.status;
        campaignTemplateCopy.campaignDescription = campaignTemplate.campaignDescription;
        campaignTemplateCopy.startDate = this.dateUtils.convertLocalDateToServer(campaignTemplate.startDate);
        campaignTemplateCopy.recurrenceType = campaignTemplate.recurrenceType;
        campaignTemplateCopy.recurrenceEndDate = this.dateUtils.convertLocalDateToServer(campaignTemplate.recurrenceEndDate);
        campaignTemplateCopy.inPlayerTimezone = campaignTemplate.inPlayerTimezone;
        campaignTemplateCopy.scheduledTime = campaignTemplate.scheduledTime;
       // campaignTemplateCopy.contentName = campaignTemplate.contentName;
       campaignTemplateCopy.contentTitle = campaignTemplate.contentTitle;
        campaignTemplateCopy.contentBody = campaignTemplate.contentBody;
        campaignTemplateCopy.metaData = campaignTemplate.metaData;
        campaignTemplateCopy.languageSelected = campaignTemplate.languageSelected;
        campaignTemplateCopy.sendImmediately = campaignTemplate.sendImmediately;
        campaignTemplateCopy.optimoveInstances = campaignTemplate.optimoveInstances;
        campaignTemplateCopy.pushToOptimoveInstances = campaignTemplate.pushToOptimoveInstances;

        const campaignTemplateFilterCriteria: CampaignTemplateFilterCriterion[] = [];
        for (const campaignTemplateFilterCriterion of campaignTemplate.targetGroupFilterCriteria) {
            if (Array.isArray(campaignTemplateFilterCriterion.filterOptionValue)) {
                campaignTemplateFilterCriteria.push(new CampaignTemplateFilterCriterion(
                    campaignTemplateFilterCriterion.filterOption,
                    campaignTemplateFilterCriterion.filterOptionLookUp,
                    campaignTemplateFilterCriterion.filterOptionComparison,
                    campaignTemplateFilterCriterion.filterOptionValue));
            } else {
                const optionValues: string[] = [];
                optionValues.push(campaignTemplateFilterCriterion.filterOptionValue);
                campaignTemplateFilterCriteria.push(new CampaignTemplateFilterCriterion(
                    campaignTemplateFilterCriterion.filterOption,
                    campaignTemplateFilterCriterion.filterOptionLookUp,
                    campaignTemplateFilterCriterion.filterOptionComparison,
                    optionValues));
            }
        }
        campaignTemplateCopy.targetGroupFilterCriteria = campaignTemplateFilterCriteria;

        const campaignTemplateContentCriteria: CampaignTemplateContentCriterion[] = [];
        for (const campaignTemplateContentCriterion of campaignTemplate.targetGroupContentCriteria) {
                campaignTemplateContentCriteria.push(new CampaignTemplateContentCriterion(
                   // campaignTemplateContentCriterion.contentName,
                   campaignTemplateContentCriterion.contentTitle,
                    campaignTemplateContentCriterion.contentBody,
                    campaignTemplateContentCriterion.languageSelected));
        }
        campaignTemplateCopy.targetGroupContentCriteria = campaignTemplateContentCriteria;

        return campaignTemplateCopy;
    }
}
