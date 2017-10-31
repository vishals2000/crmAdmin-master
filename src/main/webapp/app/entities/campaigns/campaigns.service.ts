import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Campaigns } from './campaigns.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CampaignsService {

    private resourceUrl = 'api/campaigns';

    constructor(private http: Http) { }

    create(campaigns: Campaigns): Observable<Campaigns> {
        const copy = this.convert(campaigns);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(campaigns: Campaigns): Observable<Campaigns> {
        const copy = this.convert(campaigns);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<Campaigns> {
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

    private convert(campaigns: Campaigns): Campaigns {
        const copy: Campaigns = Object.assign({}, campaigns);
        return copy;
    }
}
