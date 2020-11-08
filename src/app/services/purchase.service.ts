import { Injectable } from '@angular/core';
import { API_END_POINT } from '../app.constants';
import { PurchaseStatus } from '../models/enums';
import { Purchase } from '../models/view.models/purchase.entity';
import { GlobalService } from './common/global.service';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private httpService: HttpService, private globalService: GlobalService) { }

  bulkCreate(purchases: Purchase[], orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.bulkAddPurchase, {
      purchases: purchases,
      orderId:orderId
    }).then(data => {
        return data;
      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  create(purchase: Purchase): Promise<any> {
    return this.httpService.post(API_END_POINT.addPurchase, {
      orderId: purchase.OrderId,
      amount: purchase.Amount,
      method: purchase.Method,
      Status: purchase.Method
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  updateStatus(purchaseId: number, status: PurchaseStatus): Promise<any> {
    return this.httpService.post(API_END_POINT.updatePurchaseStatus, {
      status: status,
      id: purchaseId
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }
}
