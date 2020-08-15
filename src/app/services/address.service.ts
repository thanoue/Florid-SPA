import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { District, Ward } from 'src/app/models/entities/address.entity';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AddressService {


  constructor(private httpService: HttpService) {
  }

  getAllDistrict(): Promise<District[]> {

    return this.httpService.get(API_END_POINT.getAllDistricts).then(data => {

      let districts: District[] = [];

      data.districts.forEach(districtRaw => {
        districts.push({
          Id: districtRaw.Id,
          Name: districtRaw.Name,
        });
      });

      return districts;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getAllWards(): Promise<Ward[]> {
    return this.httpService.get(API_END_POINT.getAllWards).then(data => {
      let wards: Ward[] = [];

      data.wards.forEach(wardRaw => {
        wards.push({
          Id: wardRaw.Id,
          Name: wardRaw.Name,
          DistrictId: wardRaw.DistrictId
        });
      });

      return wards;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

}
