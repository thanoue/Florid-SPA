import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LocalService } from './local.service';
import { shareReplay, timeout, catchError } from 'rxjs/operators';
import { REQUEST_TIMEOUT } from 'src/app/app.constants';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  static defaultHeader = {
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Access-Control-Max-Age': '3600',
  };

  static formdataHeader = {
    'enctype': 'multipart/form-data'
  };

  private caches = {};
  protected apiHost = environment.base_domain;
  protected apiUrlPrefix = '/api';

  protected headers: HttpHeaders;

  public createAPIURL(path: string): string {
    return this.apiHost + this.apiUrlPrefix + path;
  }

  constructor(protected http: HttpClient, protected globalService: GlobalService) {
    this.headers = new HttpHeaders(HttpService.defaultHeader);
  }

  private loadToken(isForm: boolean = false) {

    const token = LocalService.getApiAccessToken();

    if (token === '' || !token) {
      this.headers = new HttpHeaders(isForm ? HttpService.formdataHeader : HttpService.defaultHeader);
    } else {
      this.headers = new HttpHeaders({
        ...isForm ? HttpService.formdataHeader : HttpService.defaultHeader,
        ...{ 'x-access-token': `${token}` }
      });
    }
  }

  public handleError(err) {

    this.globalService.stopLoading();

    if (err.error.message) {
      this.globalService.showError(err.error.message);
      return;
    }

    if (err.message) {
      this.globalService.showError(err.message);
      return;
    }

    if (err.error) {
      this.globalService.showError(err.error);
      return;
    }

    this.globalService.showError(err);

  }

  public get(url: string, params?: HttpParams | any, cache: boolean = false): Promise<Object | any> {

    this.loadToken();

    if (cache && this.caches[url]) {
      this.globalService.startLoading();
      return this.caches[url];
    }

    const fullUrl = this.createAPIURL(url);

    this.globalService.startLoading();

    const res = this.http.get(fullUrl, { headers: this.headers, params: params })
      .pipe(shareReplay(1),
        timeout(REQUEST_TIMEOUT)
      );

    var promise = res.toPromise();

    if (cache) {
      this.caches[url] = res;
    }

    return promise.then((res) => {
      this.globalService.stopLoading();
      return res;
    });

  }

  public post(url: string, params?: HttpParams | any, loader = true): Promise<object | any> {

    this.loadToken();
    const fullUrl = this.createAPIURL(url);

    if (loader) {
      this.globalService.startLoading();
    }

    const request = this.http.post(fullUrl, params, { headers: this.headers })
      .pipe(timeout(REQUEST_TIMEOUT));

    var promise = request.toPromise();

    return promise.then((res) => {
      if (loader) {
        this.globalService.stopLoading();
      }
      return res;
    });
  }

  public postForm(url: string, params?: HttpParams | any, loader = true): Promise<object | any> {

    this.loadToken(true);

    const fullUrl = this.createAPIURL(url);

    if (loader) {
      this.globalService.startLoading();
    }

    var body = this.parseFormdata(params);

    const request = this.http.post(fullUrl, body, { headers: this.headers })
      .pipe(timeout(REQUEST_TIMEOUT));

    var promise = request.toPromise();

    return promise.then((res) => {
      if (loader) {
        this.globalService.stopLoading();
      }
      return res;
    });
  }

  private parseFormdata(model: any) {
    const formdata = new FormData();
    Object.keys(model || {}).forEach(p => {
      formdata.append(p, model[p]);
    });

    return formdata;
  }

}
