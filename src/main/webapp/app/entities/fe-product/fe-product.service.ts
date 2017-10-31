import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FeProduct } from './fe-product.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class FeProductService {

    private resourceUrl = 'api/fe-products';

    constructor(private http: Http) { }

    create(feProduct: FeProduct): Observable<FeProduct> {
        const copy = this.convert(feProduct);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(feProduct: FeProduct): Observable<FeProduct> {
        const copy = this.convert(feProduct);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: string): Observable<FeProduct> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    queryProductsForFrontEnd(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get('api/productsForFrontEnd' + `/${req.frontEnd}`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    queryDistinctFe(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get('api/fe-products-distinctFe', options)
            .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(feProduct: FeProduct): FeProduct {
        const copy: FeProduct = Object.assign({}, feProduct);
        return copy;
    }
}
