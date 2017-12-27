import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CampaignStat } from './campaign-stat.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CampaignStatService {

    private resourceUrl = 'api/campaign-stats';

    constructor(private http: Http) { }

    create(campaignStat: CampaignStat): Observable<CampaignStat> {
        const copy = this.convert(campaignStat);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(campaignStat: CampaignStat): Observable<CampaignStat> {
        const copy = this.convert(campaignStat);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<CampaignStat> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(campaignStat: CampaignStat): CampaignStat {
        const copy: CampaignStat = Object.assign({}, campaignStat);
        return copy;
    }
}
