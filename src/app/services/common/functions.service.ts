import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { LocalService } from './local.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }

  public static excuteFunction(name: string, dataObject?: any): Promise<any> {

    const func = firebase.functions().httpsCallable(name);

    const params = {
      data: dataObject,
      //   token: LocalService.getAccessToken()
    };

    return func(params).then(res => {
      return res.data;
    });

  }
}
