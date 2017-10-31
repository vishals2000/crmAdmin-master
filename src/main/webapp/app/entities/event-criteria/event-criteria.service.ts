import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventCriteria } from './event-criteria.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EventCriteriaService {

    private resourceUrl = 'api/event-criteria';

    constructor(private http: Http) { }

    create(eventCriteria: EventCriteria): Observable<EventCriteria> {
        const copy = this.convert(eventCriteria);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(eventCriteria: EventCriteria): Observable<EventCriteria> {
        const copy = this.convert(eventCriteria);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<EventCriteria> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    // queryDistictFilterOptionEventNames(req?: any): Observable<ResponseWrapper> {
    //     const options = createRequestOption(req);
    //     console.log('request event-criteria-distinctEventNames for ' + req.filterOption + ' ' + req.frontEnd + ' ' + req.product);
    //     return this.http.get('api/event-criteria-distinctEventNames' + `/${req.frontEnd}` + `/${req.product}`, options).map((res: Response) => this.convertResponse(res));
    // }

    queryEvents(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        console.log('request event-criteria-frontend-product for ' + req.filterOption + ' ' + req.frontEnd + ' ' + req.product);
        return this.http.get('api/event-criteria-frontend-product' + `/${req.frontEnd}` + `/${req.product}`, options).map((res: Response) => this.convertResponse(res));
    }

    private convertQueryEventsResponse(res: Response): ResponseWrapper {
        // const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, res, res.status);
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(eventCriteria: EventCriteria): EventCriteria {
        const copy: EventCriteria = Object.assign({}, eventCriteria);
        return copy;
    }
}
