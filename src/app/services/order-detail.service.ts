import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { OrderDetail } from '../models/entities/order.entity';
import { OrderDetailStates } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService extends BaseService<OrderDetail>  {

  protected tableName = '/orderDetails';

  constructor() {
    super();
  }

  getAllByState(state: OrderDetailStates): Promise<OrderDetail[]> {

    this.startLoading();

    return this.tableRef.orderByChild('State').equalTo(state).once('value').then(snapshot => {
      this.stopLoading();
      const res: OrderDetail[] = [];

      snapshot.forEach(data => {
        res.push(data.val() as OrderDetail);
      });

      return res;

    })
      .catch(error => {
        this.stopLoading();
        this.globalService.showError(error.toString());
        return [];
      });

  }

  async deleteAllByOrderId(orderId: string): Promise<boolean> {

    return await this.tableRef.orderByChild('OrderId').equalTo(orderId).once('value').then(snapshot => {

      if (!snapshot || snapshot.numChildren() <= 0) {
        return true;
      }

      snapshot.forEach((item) => {
        this.delete(item.key);
      });

      return true;
    })
      .catch(error => {
        this.globalService.showError(error);
        return false;
      });
  }

  getNextMakingSortOrder(): Promise<number> {
    return this.tableRef.orderByChild('State').equalTo(OrderDetailStates.Waiting)
      .once('value')
      .then(snapshot => {

        let maxOrder = 0;

        snapshot.forEach(snap => {
          var detail = snap.val() as OrderDetail;
          if (detail.MakingSortOrder > maxOrder)
            maxOrder = detail.MakingSortOrder;
        });

        return maxOrder + 1;
      });
  }

  getNextShippingSortOrder(): Promise<number> {
    return this.tableRef.orderByChild('State').equalTo(OrderDetailStates.DeliveryWaiting)
      .once('value')
      .then(snapshot => {

        let maxOrder = 0;

        snapshot.forEach(snap => {
          var detail = snap.val() as OrderDetail;
          if (detail.ShippingSortOrder > maxOrder)
            maxOrder = detail.ShippingSortOrder;
        });

        return maxOrder + 1;
      });
  }

  getHardcodeImageSavedCounting(name: string, callback: (count: number) => void): void {

    if (!name || name === '') {
      callback(0);
      return;
    }

    this.globalService.startLoading();
    this.tableRef.orderByChild('HardcodeProductImageName').equalTo(name).once('value').then(snapshot => {

      this.globalService.stopLoading();

      if (snapshot) {
        callback(snapshot.numChildren());
      } else {
        callback(0);
      }

    });
  }

}
