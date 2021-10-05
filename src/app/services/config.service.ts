import { Injectable } from '@angular/core';
import { API_END_POINT } from '../app.constants';
import { Config } from '../models/entities/config.entity';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private httpService: HttpService) { }

  getCurrentConfig(): Promise<Config> {
    return this.httpService.post(API_END_POINT.getCurrentConfig)
      .then(res => {

        if (res === {} || res === undefined) {
          return new Config();
        }

        return res.config;

      }).catch(err => {
        this.httpService.handleError(err);
      });
  }

  updateMemberships(): Promise<any> {
    return this.httpService.post(API_END_POINT.updateMembership)
      .then(res => {

        return res;

      }).catch(err => {
        this.httpService.handleError(err);
      });
  }

  updateConfig(config: Config): Promise<any> {

    return this.httpService.post(API_END_POINT.updateConfig, {
      memberValue: config.MemberValue,
      memberDiscount: config.MemberDiscount,
      vipValue: config.VipValue,
      vipDiscount: config.VipDiscount,
      vVipValue: config.VVipValue,
      vVipDiscount: config.VVipDiscount,
      id: config.Id
    }).then(res => {
      return config;
    }).catch(err => {
      this.httpService.handleError(err);
    });
  }
}
