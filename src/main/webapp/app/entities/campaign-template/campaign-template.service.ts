import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { CampaignTemplate, CampaignTemplateFilterCriterion, CampaignTemplateContentCriterion, CampaignTemplateMetaDataCriterion } from './campaign-template.model';
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
        if(body.sendImmediately){
            var dateObj = new Date();
            let currentHourValue = dateObj.getUTCHours();
            let currentMinValue = dateObj.getUTCMinutes();
            const todayDt1 = {
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate()
            };
            body.startDate = this.dateUtils.convertLocalDateToServer(todayDt1);
            body.recurrenceEndDate = body.startDate;
            body.scheduledTime = '' + (currentHourValue < 10 ? '0' + currentHourValue : currentHourValue) + ':' + (currentMinValue < 10 ? '0' + currentMinValue : currentMinValue) + ':00';
        }
        return this.http.post(this.resourceUrl + '/pushNotificationCampaign', body).map((res: Response) => {
            return res.json();
        });
    }

    cancelPushNotification(body: any): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl + '/cancelPushNotificationCampaign', body).map((res: Response) => {
            return res.json();
        });
    }

    getSegments(body: any): Observable<ResponseWrapper> {
        return this.http.post('api/audience-segments/loadbyFeProductForSegmentation', body).map((res: Response) => {
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
        return this.http.get(`${this.resourceUrl}/${id}/`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    getFeProduct(id: string, name: string): Observable<Response> {
        return this.http.get(`${this.resourceUrl}/${name}/${id}/`).map((res: Response) => {
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
        return this.http.get(`${this.resourceUrl}/${group}/${id}/`).map((res: Response) => {
            return res.json();
        }
        );
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + '/group/' + req.campGroupId + "/", options)
            .map((res: Response) => this.convertResponse(res));
    }

    search(req?: any, option?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(option);
        return this.http.get(this.resourceUrl + '/group/' + req.campGroupId + '/search/' + req.searchVal + "/", options)
            .map((res: Response) => this.convertResponse(res));
    }

    getPushNotificationCampaignTemplate(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(`${this.resourceUrl}/${req.campaignTemplateId}/`, options)
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
        return this.http.delete(`${this.resourceUrl}/${id}/`);
    }

    getAppCapGrpIdFromTemp(id: string): Observable<Response> {
        return this.http.get(this.resourceUrl + '/appCampaignGroupInfoWithCampaignTemplateId/' + id + "/").map((res: Response) => {
            return res.json();
        });
    }

    getAppCapGrpIdFromCapGrp(id: string): Observable<Response> {
        return this.http.get(this.resourceUrl + '/appCampaignGroupInfoWithCampaignGroupId/' + id + "/").map((res: Response) => {
            return res.json();
        });
    }

    copyCampaignTemplate(body: any, copyCount : Number): Observable<ResponseWrapper> {
        let postObj = this.convert(body);
        postObj.campaignName = "(Copy " + (copyCount > 0 ? copyCount : '' )+ ")" + postObj.campaignName;
        postObj.id = undefined;
        var dateObj = new Date();
        let currentHourValue = dateObj.getUTCHours();
        let currentMinValue = dateObj.getUTCMinutes();
        const todayDt1 = {
            year: dateObj.getUTCFullYear(),
            month: dateObj.getUTCMonth() + 1,
            day: dateObj.getUTCDate()
        };
        if(postObj.sendImmediately){
            if(currentMinValue >= 55){
                currentHourValue += 1;
                currentMinValue = (currentMinValue + 5) - 60;
            }
            else{
                currentMinValue += 5;
            }
            postObj.startDate = this.dateUtils.convertLocalDateToServer(todayDt1);
            postObj.recurrenceEndDate = postObj.startDate;
            postObj.scheduledTime = '' + (currentHourValue < 10 ? '0' + currentHourValue : currentHourValue) + ':' + (currentMinValue < 10 ? '0' + currentMinValue : currentMinValue) + ':00'
        }
        else{
            if(currentMinValue >= 55){
                currentHourValue += 1;
                currentMinValue = (currentMinValue + 5) - 60;
            }
            else{
                currentMinValue += 5;
            }
            postObj.scheduledTime = '' + (currentHourValue < 10 ? '0' + currentHourValue : currentHourValue) + ':' + (currentMinValue < 10 ? '0' + currentMinValue : currentMinValue) + ':00'

            let startDateObj = this.dateUtils.convertLocalDateFromServer(postObj.startDate);
            let endDateObj = this.dateUtils.convertLocalDateFromServer(postObj.recurrenceEndDate);
            if(startDateObj < dateObj){
                postObj.startDate = this.dateUtils.convertLocalDateToServer(todayDt1);
                if(postObj.recurrenceType.toString() === 'NONE'){
                    postObj.recurrenceEndDate = this.dateUtils.convertLocalDateToServer(todayDt1);
                }
            }
            //if(startDateObj.year)
       
        }
         return this.http.post(this.resourceUrl, postObj).map((res: Response) => {
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
        //campaignTemplateCopy.campaignDescription = campaignTemplate.campaignDescription;
        if (typeof campaignTemplate.startDate === 'object' && !campaignTemplate.startDate.hasOwnProperty("year")) {
            campaignTemplateCopy.startDate = {
                year: campaignTemplate.startDate.getFullYear(),
                month: campaignTemplate.startDate.getMonth() + 1,
                day: campaignTemplate.startDate.getDate()
            };
        }
        else{
            campaignTemplateCopy.startDate = campaignTemplate.startDate;
        }
        if (typeof campaignTemplate.recurrenceEndDate === 'object' && !campaignTemplate.recurrenceEndDate.hasOwnProperty("year")) {
            campaignTemplateCopy.recurrenceEndDate = {
                year: campaignTemplate.recurrenceEndDate.getFullYear(),
                month: campaignTemplate.recurrenceEndDate.getMonth() + 1,
                day: campaignTemplate.recurrenceEndDate.getDate()
            };
        }
        else{
            campaignTemplateCopy.recurrenceEndDate = campaignTemplate.recurrenceEndDate;
        }
        campaignTemplateCopy.startDate = this.dateUtils.convertLocalDateToServer(campaignTemplateCopy.startDate);
        campaignTemplateCopy.recurrenceType = campaignTemplate.recurrenceType;
        campaignTemplateCopy.recurrenceEndDate = this.dateUtils.convertLocalDateToServer(campaignTemplateCopy.recurrenceEndDate);
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
                    campaignTemplateFilterCriterion.filterOptionValue, undefined, undefined));
            } else {
                const optionValues: string[] = [];
                optionValues.push(campaignTemplateFilterCriterion.filterOptionValue);
                campaignTemplateFilterCriteria.push(new CampaignTemplateFilterCriterion(
                    campaignTemplateFilterCriterion.filterOption,
                    campaignTemplateFilterCriterion.filterOptionLookUp,
                    campaignTemplateFilterCriterion.filterOptionComparison,
                    optionValues,
                    undefined, undefined));
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

        const campaignTemplateMetaCriteria: CampaignTemplateMetaDataCriterion[] = [];
        if(campaignTemplate.targetGroupMetaData && campaignTemplate.targetGroupMetaData.length){
            for (const campaignTemplateMetaDCriterion of campaignTemplate.targetGroupMetaData) {
                campaignTemplateMetaCriteria.push(new CampaignTemplateMetaDataCriterion(
                    campaignTemplateMetaDCriterion.key,
                    campaignTemplateMetaDCriterion.value));
            }
        }
        campaignTemplateCopy.targetGroupMetaData = campaignTemplateMetaCriteria;
        campaignTemplateCopy.editEnabled = undefined;
        campaignTemplateCopy.launchEnabled = undefined;
        return campaignTemplateCopy;
    }
}
