import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UploadSegments } from './upload-segments.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class UploadSegmentsService {

    private resourceUrl = 'api/upload-segments';

    constructor(private http: Http) { }

    create(uploadSegments: UploadSegments): Observable<UploadSegments> {
        const copy = this.convert(uploadSegments);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(uploadSegments: UploadSegments): Observable<UploadSegments> {
        const copy = this.convert(uploadSegments);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<UploadSegments> {
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

    private convert(uploadSegments: UploadSegments): UploadSegments {
        const copy: UploadSegments = Object.assign({}, uploadSegments);
        return copy;
    }
}
