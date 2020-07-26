import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { District } from 'src/app/models/entities/address.entity';

@Injectable({
  providedIn: 'root'
})
export class DistrictAddressService extends BaseService<District> {

  protected tableName = '//address_district';

  constructor() {
    super();
  }

}
