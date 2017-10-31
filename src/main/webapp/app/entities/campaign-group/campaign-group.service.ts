import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CampaignGroup } from './campaign-group.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CampaignGroupService {

    private resourceUrl = 'api/campaign-group';

    constructor(private http: Http) { }

    create(campaignGroup: CampaignGroup): Observable<CampaignGroup> {
        const copy = this.convert(campaignGroup);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(campaignGroup: CampaignGroup): Observable<CampaignGroup> {
        const copy = this.convert(campaignGroup);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<CampaignGroup> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }
    findProjects(id: string, project: string): Observable<CampaignGroup> {
        return this.http.get(`${this.resourceUrl}/${project}/${id}`).map((res: Response) => {
            return res.json();
        }
    );
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

    private convert(campaignGroup: CampaignGroup): CampaignGroup {
        const copy: CampaignGroup = Object.assign({}, campaignGroup);
        return copy;
    }
}
