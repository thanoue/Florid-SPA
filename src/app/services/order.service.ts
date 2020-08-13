import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order, OrderDetail, CustomerReceiverDetail } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private httpService: HttpService, private globalService: GlobalService) {
  }

  getNormalDayOrdersCount(): Promise<number> {
    return this.httpService.get(API_END_POINT.getNormalDayOrdersCount)
      .then(data => {
        return data.count;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }



  deleteOrderDetailByOrderId(orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteOrderDetailByOrderId, {
      orderId: orderId
    })
      .then(res => {
        return;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  addOrderDetails(orderDetails: OrderDetail[]): Promise<any> {

    return this.httpService.post(API_END_POINT.addOrderDetails, {
      orderDetails: orderDetails
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  addOrder(order: Order): Promise<Order> {
    return this.httpService.post(API_END_POINT.addOrder, {
      customerId: order.CustomerId,
      id: order.Id,
      vatIncluded: order.VATIncluded,
      totalAmount: order.TotalAmount,
      totalPaidAmount: order.TotalAmount,
      gaindedScore: order.GainedScore,
      scoreUsed: order.ScoreUsed,
      orderType: order.OrderType
    })
      .then(data => {
        return order;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }
}
