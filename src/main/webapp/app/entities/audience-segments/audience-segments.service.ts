import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AudienceSegments } from './audience-segments.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class AudienceSegmentsService {

    private resourceUrl = 'api/audience-segments';

    constructor(private http: Http) { }

    create(audienceSegments: AudienceSegments): Observable<AudienceSegments> {
        const copy = this.convert(audienceSegments);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(audienceSegments: AudienceSegments): Observable<AudienceSegments> {
        const copy = this.convert(audienceSegments);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<AudienceSegments> {
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

    private convert(audienceSegments: AudienceSegments): AudienceSegments {
        const copy: AudienceSegments = Object.assign({}, audienceSegments);
        return copy;
    }
}
