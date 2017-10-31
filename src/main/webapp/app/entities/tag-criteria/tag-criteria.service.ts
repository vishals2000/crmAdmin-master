import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { TagCriteria } from './tag-criteria.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class TagCriteriaService {

    private resourceUrl = 'api/tag-criteria';

    constructor(private http: Http) { }

    create(tagCriteria: TagCriteria): Observable<TagCriteria> {
        const copy = this.convert(tagCriteria);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(tagCriteria: TagCriteria): Observable<TagCriteria> {
        const copy = this.convert(tagCriteria);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<TagCriteria> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    // queryDistictFilterOptionTagNames(req?: any): Observable<ResponseWrapper> {
    //     const options = createRequestOption(req);
    //     console.log('request tag-criteria-distinctTagNames for ' + req.frontEnd + ' ' + req.product);
    //     return this.http.get('api/tag-criteria-distinctTagNames' + `/${req.frontEnd}` + `/${req.product}`, options).map((res: Response) => this.convertResponse(res));
    // }

    queryTags(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        console.log('request tag-criteria-frontend-product for ' + req.frontEnd + ' ' + req.product);
        return this.http.get('api/tag-criteria-frontend-product' + `/${req.frontEnd}` + `/${req.product}`, options).map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(tagCriteria: TagCriteria): TagCriteria {
        const copy: TagCriteria = Object.assign({}, tagCriteria);
        return copy;
    }
}
