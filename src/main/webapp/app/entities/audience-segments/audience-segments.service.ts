import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

import { AudienceSegments } from './audience-segments.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AudienceSegmentsService {

    private resourceUrl = 'api/audience-segments';
    private getAppSegments = '/api/audience-segments/loadbyFeProduct ';

    private messageSource = new BehaviorSubject<string[]>([]);
    currentAppInfo = this.messageSource.asObservable();

    constructor(private http: Http) { }

    changeAppInfo(appInfo: string[]) {
        this.messageSource.next(appInfo);
    }

    upload(audienceSegments: AudienceSegments, formData: FormData): Observable<AudienceSegments> {
        const copy = this.convert(audienceSegments);
        const headers = new Headers();
        // headers.append('Content-Type', undefined);
        const options = new RequestOptions({
            headers: headers,
            params : copy
         });
        return this.http.post(this.resourceUrl + '/upload-segment', formData, options)
        .map(response => response.json())
        .catch(error => Observable.throw(error));
    }

    uploadToExisting(audienceSegments: any, formData: FormData): Observable<AudienceSegments> {
        const copy = this.convert(audienceSegments);
        const headers = new Headers();
        // headers.append('Content-Type', undefined);
        const options = new RequestOptions({
            headers: headers,
            params : copy
         });
        return this.http.post(this.resourceUrl + '/edit-segment', formData, options)
        .map(response => response.json())
        .catch(error => Observable.throw(error));
    }

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

    query(req?: any, reqOptions?:any): Observable<ResponseWrapper> {
        const req1 = this.convert(req);
        const options = createRequestOption(reqOptions);
        return this.http.post(this.resourceUrl + "/loadbyFeProduct",req1, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.post(this.resourceUrl + "/delete/", {segId : id});
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
