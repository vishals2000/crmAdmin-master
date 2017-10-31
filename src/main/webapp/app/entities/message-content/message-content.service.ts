import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { MessageContent } from './message-content.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class MessageContentService {

    private resourceUrl = 'api/message-contents';

    constructor(private http: Http) { }

    create(messageContent: MessageContent): Observable<MessageContent> {
        const copy = this.convert(messageContent);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(messageContent: MessageContent): Observable<MessageContent> {
        const copy = this.convert(messageContent);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<MessageContent> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }
    queryMessageContent(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get('api/message-contents' + `/${req.frontEnd}` + `/${req.product}`, options)
            .map((res: Response) => this.convertMessageContentResponse(res));
    }
    private convertMessageContentResponse(res: Response): ResponseWrapper {
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

    private convert(messageContent: MessageContent): MessageContent {
        const copy: MessageContent = Object.assign({}, messageContent);
        return copy;
    }
}
