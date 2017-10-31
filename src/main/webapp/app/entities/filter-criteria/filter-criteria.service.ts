import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FilterCriteria } from './filter-criteria.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class FilterCriteriaService {

    private resourceUrl = 'api/filter-criteria';

    constructor(private http: Http) { }

    create(filterCriteria: FilterCriteria): Observable<FilterCriteria> {
        const copy = this.convert(filterCriteria);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(filterCriteria: FilterCriteria): Observable<FilterCriteria> {
        const copy = this.convert(filterCriteria);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<FilterCriteria> {
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

    queryDistictFilterOptions(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get('api/filter-criteria-fe-product' + `/${req.frontEnd}` + `/${req.product}`, options)
        .map((res: Response) => this.convertResponse(res));
    }

    // queryDistictFilterOptionLookUpValues(req?: any): Observable<ResponseWrapper> {
    //     const options = createRequestOption(req);
    //     console.log('request filterOptionLookUp for ' + req.filterOption + ' ' + req.frontEnd + ' ' + req.product);
    //     return this.http.get('api/filter-criteria-fe-product' + `/${req.frontEnd}` + `/${req.product}`, options).map((res: Response) => this.convertResponse(res));
    // }

    queryFilters(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        console.log('request filter-criteria-frontend-product for ' + req.filterOption + ' ' + req.frontEnd + ' ' + req.product);
        return this.http.get('api/filter-criteria-frontend-product' + `/${req.frontEnd}` + `/${req.product}`, options)
        .map((res: Response) => this.convertQueryFiltersResponse(res));
    }

    private convertQueryFiltersResponse(res: Response): ResponseWrapper {
        console.log('actual response ' + res);
        console.log('json response ' + res.json());
        return new ResponseWrapper(res.headers, res.json(), res.status);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(filterCriteria: FilterCriteria): FilterCriteria {
        const copy: FilterCriteria = Object.assign({}, filterCriteria);
        return copy;
    }
}
