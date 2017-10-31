import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { CampaignTemplate } from './campaign-template.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CampaignTemplateService {

    private resourceUrl = 'api/campaign-templates';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(campaignTemplate: CampaignTemplate): Observable<CampaignTemplate> {
        const copy = this.convert(campaignTemplate);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
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
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(campaignTemplate.startDate);
        copy.recurrenceEndDate = this.dateUtils
            .convertLocalDateToServer(campaignTemplate.recurrenceEndDate);
        return copy;
    }
}
