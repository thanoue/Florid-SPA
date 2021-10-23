import { Injectable } from '@angular/core';
import { API_END_POINT } from '../app.constants';
import { Purchase } from '../models/view.models/purchase.entity';
import { HttpService } from './common/http.service';
import { PurchaseMethods } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private httpService: HttpService) { }

  delete(purchaseId: number): Promise<any> {
    return this.httpService.post(API_END_POINT.deletePurchase, {
      purchaseId
    }).then(data => {

      return data;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });

  }

  getByTerm(term: string, page: number, size: number, startTime: number, endTime: number, isUnknownOnly: boolean, method: PurchaseMethods):
    Promise<{
      totalItemCount: number,
      items: Purchase[],
      totalPages: number,
      currentPage: number
    }> {

    return this.httpService.post(API_END_POINT.getPurchaseByTerm, {
      page: page - 1,
      size,
      startTime,
      endTime,
      term,
      isUnknownOnly,
      method
    }).then(data => {

      const res = {
        totalItemCount: 0,
        items: [],
        totalPages: 0,
        currentPage: 0
      };

      res.totalItemCount = data.totalItemCount;
      res.currentPage = data.currentPage;
      res.totalPages = data.totalPages;

      data.items.forEach(rawPurchase => {
        const newPur = new Purchase();

        newPur.Id = rawPurchase.Id;
        newPur.AddingTime = rawPurchase.AddingTime;
        newPur.Amount = rawPurchase.Amount;
        newPur.Method = rawPurchase.Method;
        newPur.OrderId = rawPurchase.OrderId ? rawPurchase.OrderId : '';
        newPur.Note = rawPurchase.Note ? rawPurchase.Note : '';

        res.items.push(newPur);

      });

      return res;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  bulkInsert(purchases: Purchase[]): Promise<any> {

    return this.httpService.post(API_END_POINT.bulkInsertPurchase, {
      purchases,
    }).then(data => {
      return data;
    });

  }

  bulkCreate(purchases: Purchase[], orderId: string, callback: () => void): void {

    const addingPurchase = [];

    purchases.forEach(item => {
      if (!item.Id || item.Id === 0) {
        addingPurchase.push(item);
      }
    });

    if (addingPurchase.length <= 0) {
      callback();
    }

    this.httpService.post(API_END_POINT.bulkAddPurchase, {
      purchases: addingPurchase,
      orderId
    }).then(data => {
      callback();
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  assignToOrder(purchaseId: number, orderId: string, amount: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignPurchaseOrder, {
      orderId,
      purchaseId,
      amount
    }).then(data => {
      return data;
    });
  }

  update(purchase: Purchase, oldOrderId: string, oldAmount: number): Promise<any> {
    return this.httpService.post(API_END_POINT.updatePurchaseOrder, {
      orderId: purchase.OrderId,
      amount: purchase.Amount,
      method: purchase.Method,
      id: purchase.Id,
      oldAmount,
      oldOrderId,
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
      newtotalPaidAmount,
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

  addAndAssign(purchase: Purchase): Promise<any> {
    return this.httpService.post(API_END_POINT.addAndAsign, purchase).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  refund(refundAmount: number, orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.addRefund, {
      orderId,
      amount: refundAmount,
      addingTime: (new Date()).getTime()
    }).then(data => {
      return data.message;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }
}
