import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { TargetGroupCriteria, TargetGroupFilterCriterion } from './target-group-criteria.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class TargetGroupCriteriaService {

    private resourceUrl = 'api/target-group-criteria';

    constructor(private http: Http) { }

    create(targetGroupCriteria: TargetGroupCriteria): Observable<TargetGroupCriteria> {
        const copy = this.convert(targetGroupCriteria);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(targetGroupCriteria: TargetGroupCriteria): Observable<TargetGroupCriteria> {
        const copy = this.convert(targetGroupCriteria);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<TargetGroupCriteria> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    queryTargetGroup(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + `/${req.frontEnd}` + `/${req.product}`, options)
            .map((res: Response) => this.converTargetGroupResponse(res));
    }

    private converTargetGroupResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(targetGroupCriteria: TargetGroupCriteria): TargetGroupCriteria {
        const copy: TargetGroupCriteria = Object.assign({}, targetGroupCriteria);
        const targetGroupCriteriaCopy: TargetGroupCriteria = new TargetGroupCriteria();
        targetGroupCriteriaCopy.frontEnd = targetGroupCriteria.frontEnd;
        targetGroupCriteriaCopy.product = targetGroupCriteria.product;
        targetGroupCriteriaCopy.id = targetGroupCriteria.id;
        targetGroupCriteriaCopy.name = targetGroupCriteria.name;
        const targetGroupFilterCritera: TargetGroupFilterCriterion[] = [];
        for (const targetGroupFilterCriterion of targetGroupCriteria.targetGroupFilterCriteria) {
            if (Array.isArray(targetGroupFilterCriterion.filterOptionValue)) {
                targetGroupFilterCritera.push(new TargetGroupFilterCriterion(targetGroupFilterCriterion.filterOption,
                    targetGroupFilterCriterion.filterOptionLookUp,
                    targetGroupFilterCriterion.filterOptionComparison,
                    targetGroupFilterCriterion.filterOptionValue));
            } else {
                const optionValues: string[] = [];
                optionValues.push(targetGroupFilterCriterion.filterOptionValue);
                targetGroupFilterCritera.push(new TargetGroupFilterCriterion(targetGroupFilterCriterion.filterOption,
                    targetGroupFilterCriterion.filterOptionLookUp,
                    targetGroupFilterCriterion.filterOptionComparison,
                    optionValues));
            }
        }
        targetGroupCriteriaCopy.targetGroupFilterCriteria = targetGroupFilterCritera;
        return targetGroupCriteriaCopy;
    }
}
