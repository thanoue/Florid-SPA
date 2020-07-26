import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order } from '../models/entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order> {

  protected tableName = '/orders';

  constructor() {
    super()
  }


  getNextIndex(): Promise<number> {

    return this.tableRef.orderByChild('Index').limitToLast(1).once('value').then(snapShot => {

      let index = 0;

      snapShot.forEach(snap => {
        index = (snap.val() as Order).Index;
      })

      return index + 1;
    }).catch(() => {

      return 1;

    });
  }
}
