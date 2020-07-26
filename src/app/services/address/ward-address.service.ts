import { Injectable } from '@angular/core';
import { BaseService } from '../common/base.service';
import { Ward } from 'src/app/models/entities/address.entity';

@Injectable({
  providedIn: 'root'
})
export class WardAddressService extends BaseService<Ward> {

  protected tableName = '/address_wards';

  constructor() {
    super();
  }
}
