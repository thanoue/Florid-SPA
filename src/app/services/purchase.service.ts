import { Injectable } from '@angular/core';
import { start } from 'repl';
import { API_END_POINT } from '../app.constants';
import { PurchaseStatus } from '../models/enums';
import { Purchase } from '../models/view.models/purchase.entity';
import { GlobalService } from './common/global.service';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private httpService: HttpService) { }

  getByStatuses(statuses: PurchaseStatus[], page: number, size: number, startTime: number, endTime: number, isUnknownOnly: boolean):
    Promise<{
      totalItemCount: number,
      items: Purchase[],
      totalPages: number,
      currentPage: number
    }> {

    return this.httpService.post(API_END_POINT.getPurchasesByStatuses, {
      page: page - 1,
      size: size,
      startTime: startTime,
      endTime: endTime,
      statuses: statuses,
      isUnknownOnly: isUnknownOnly
    }).then(data => {

      let res = {
        totalItemCount: 0,
        items: [],
        totalPages: 0,
        currentPage: 0
      };

      res.totalItemCount = data.totalItemCount;
      res.currentPage = data.currentPage;
      res.totalPages = data.totalPages;

      data.items.forEach(rawPurchase => {
        let newPur = new Purchase();

        newPur.Id = rawPurchase.Id;
        newPur.AddingTime = rawPurchase.AddingTime;
        newPur.Amount = rawPurchase.Amount;
        newPur.Method = rawPurchase.Method;
        newPur.Status = rawPurchase.Status;
        newPur.OrderId = rawPurchase.OrderId ? rawPurchase.OrderId : "";
        newPur.Note = rawPurchase.Note ? rawPurchase.Note : "";

        res.items.push(newPur);

      });

      return res;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    })

  }

  bulkInsert(purchases: Purchase[]) : Promise<any>{

        return  this.httpService.post(API_END_POINT.bulkInsertPurchase, {
          purchases: purchases,
        }).then(data => {
          return data;
        });
        
  }

  bulkCreate(purchases: Purchase[], orderId: string, callback: () => void): void {

    let addingPurchase = [];

    purchases.forEach(item => {
      if (!item.Id || item.Id == 0)
        addingPurchase.push(item);
    });

    if (addingPurchase.length <= 0)
      callback();

    this.httpService.post(API_END_POINT.bulkAddPurchase, {
      purchases: addingPurchase,
      orderId: orderId
    }).then(data => {
      callback();
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  assignToOrder(purchaseId: number, orderId: string, amount: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignPurchaseOrder, {
      orderId: orderId,
      purchaseId: purchaseId,
      amount: amount
    }).then(data => {
      return data;
    })
  }

  update(purchase: Purchase, oldOrderId: string, oldAmount: number): Promise<any> {
    return this.httpService.post(API_END_POINT.updatePurchaseOrder, {
      orderId: purchase.OrderId,
      amount: purchase.Amount,
      method: purchase.Method,
      status: purchase.Status,
      id: purchase.Id,
      oldAmount: oldAmount,
      oldOrderId: oldOrderId,
      addingTime: purchase.AddingTime,
      note: purchase.Note
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  createOrUpdate(purchase: Purchase, newtotalPaidAmount: number): Promise<any> {
    return this.httpService.post(API_END_POINT.addPurchase, {
      orderId: purchase.OrderId,
      amount: purchase.Amount,
      method: purchase.Method,
      status: purchase.Status,
      newtotalPaidAmount: newtotalPaidAmount,
      id: purchase.Id,
      addingTime: purchase.AddingTime,
      note: purchase.Note
    }).then(data => {
      return data.purchase;
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
