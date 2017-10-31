import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Projects } from './projects.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProjectsService {

    private resourceUrl = 'api/projects';

    constructor(private http: Http) { }

    create(projects: Projects): Observable<Projects> {
        const copy = this.convert(projects);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(projects: Projects): Observable<Projects> {
        const copy = this.convert(projects);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<Projects> {
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

    private convert(projects: Projects): Projects {
        const copy: Projects = Object.assign({}, projects);
        return copy;
    }
}
