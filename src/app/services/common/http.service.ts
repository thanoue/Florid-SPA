import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LocalService } from './local.service';
import { shareReplay, timeout, catchError } from 'rxjs/operators';
import { REQUEST_TIMEOUT } from 'src/app/app.constants';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxImageCompressService, DOC_ORIENTATION } from 'ngx-image-compress';

declare function isOnMobile(): any;

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

  maxFileSize = 800000;

  protected headers: HttpHeaders;

  public createAPIURL(path: string): string {
    return this.apiHost + this.apiUrlPrefix + path;
  }

  constructor(protected http: HttpClient, private router: Router, protected globalService: GlobalService, protected imageCompress: NgxImageCompressService) {
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

    if (err.status == 403 || err.status == 401) {
      if (!isOnMobile()) {
        this.router.navigate(['admin/login']);
      } else {
        this.router.navigate(['staff/login']);
      }
    }

    console.log(err);

    if (err.error && err.error.message) {
      this.globalService.showError(err.error.message);
      return;
    }

    if (err.error) {
      this.globalService.showError(err.error);
      return;
    }


    if (err.message) {
      this.globalService.showError(err.message);
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
    }).catch(err => {
      this.handleError(err);
    });
  }

  public async compressImage(src: File): Promise<File> {

    let fileSize = src.size;
    console.log('original size ', fileSize);

    if (fileSize <= this.maxFileSize) {
      return new Promise<File>((resolve, reject) => { resolve(src) }).then(res => { return res });
    }

    return new Promise<File>((resolve, reject) => {

      try {

        var reader = new FileReader();

        reader.onload = (_event) => {

          this.imageCompress.getOrientation(src).then(ori => {

            this.imageCompress.compressFile(reader.result.toString(), ori, undefined, this.getspecificQuality(src))
              .then(async res => {

                let response = await fetch(res);
                let blob = await response.blob();

                const file = new File([blob], "result.png", { type: "image/png" });

                console.log('resized  size ', file.size);

                resolve(file);

              });
          })
        }

        reader.readAsDataURL(src);
      }
      catch (err) {
        reject(err);
      }

    }).then(file => {
      return file;
    });
  }

  getspecificQuality(file: File): number {

    let count = file.size;

    return (this.maxFileSize / count) * 100;

  }


  public async postForm(url: string, params?: HttpParams | any, loader = true): Promise<object | any> {

    this.loadToken(true);

    const fullUrl = this.createAPIURL(url);

    if (loader) {
      this.globalService.startLoading();
    }

    let arr = Object.keys(params || {});

    for (let i = 0; i < arr.length; i++) {

      let p = arr[i];

      if (params[p] instanceof File) {

        params[p] = await this.compressImage(params[p]);

      }

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
