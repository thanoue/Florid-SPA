import { Component } from '@angular/core';
import { PurchaseMethods, PurchaseStatus } from 'src/app/models/enums';
import { OrderViewModel } from 'src/app/models/view.models/order.model';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';

declare function openQR(): any;
declare function moveCursor(id: string, pos: number);
declare function purchaseDoing(cancel: () => void): any;
declare function dismissPurchaseDialog(): any;

@Component({
  selector: 'app-view-purchase',
  templateUrl: './view-purchase.component.html',
  styleUrls: ['./view-purchase.component.css']
})
export class ViewPurchaseComponent extends BaseComponent {

  Title = 'Cập nhật thanh toán';
  purchaseItems: Purchase[];
  order: OrderViewModel;
  purchaseType = PurchaseMethods;
  protected IsDataLosingWarning = false;
  qrContent: string;
  qrContentTemplate = "";
  currTotalPaidAmount = 0;
  currentPurchase: Purchase;

  get totalBalance(): number {
    return this.order ? this.order.TotalAmount - this.order.TotalPaidAmount : 0;
  }

  constructor(private purchaseService: PurchaseService) {
    super();
    this.purchaseItems = [];
    this.order = this.globalOrder;
    this.qrContent = "";
    this.currentPurchase = new Purchase();
  }

  protected Init() {
    this.purchaseItems = this.globalPurchases;
  }

  selectItem(purchase: Purchase) {

    this.currTotalPaidAmount = this.order.TotalPaidAmount;

    this.order.TotalPaidAmount -= purchase.Amount;

    this.currentPurchase = new Purchase();
    this.currentPurchase.Id = purchase.Id;

    this.currentPurchase.Amount = purchase.Amount;
    this.currentPurchase.Method = purchase.Method;
    this.currentPurchase.Status = purchase.Status;

    purchaseDoing(() => {

      this.order.TotalPaidAmount = this.currTotalPaidAmount;

    });

  }

  addPurchase() {

    this.currTotalPaidAmount = this.order.TotalPaidAmount;

    this.currentPurchase = new Purchase();
    this.currentPurchase.Id = -1;

    this.currentPurchase.Amount = this.totalBalance;
    this.currentPurchase.Method = PurchaseMethods.Cash;
    this.currentPurchase.Status = PurchaseStatus.Completed;

    purchaseDoing(() => {

    });
  }

  onPayChanged(value) {

    if (this.currentPurchase.Amount < 10) {

      this.currentPurchase.Amount *= 1000;

      this.moveCursor(this.currentPurchase.Amount.toString().length, 'Amount');

    }

    this.currentPurchase.Amount = + this.currentPurchase.Amount;

  }

  onPayFocus() {

    if (!this.currentPurchase.Amount) {
      this.currentPurchase.Amount = 0;
    }

    this.moveCursor(this.currentPurchase.Amount.toString().length, 'Amount');

  }

  purchaseConfirm() {

    if (this.currentPurchase.Amount > this.totalBalance || this.currentPurchase.Amount <= 0) {
      this.showError('Số tiền không hợp lệ!');
      return;
    }

    let purchase = new Purchase();

    purchase.OrderId = this.order.OrderId;
    purchase.Id = this.currentPurchase.Id;
    purchase.Amount = +this.currentPurchase.Amount;
    purchase.Method = this.currentPurchase.Method;
    purchase.Status = this.currentPurchase.Status;
    purchase.AddingTime = new Date().getTime();

    this.order.TotalPaidAmount += purchase.Amount;

    this.purchaseService.createOrUpdate(purchase, this.order.TotalPaidAmount).then(item => {

      if (purchase.Id > 0) {

        let item = this.purchaseItems.filter(p => p.Id == purchase.Id)[0];

        item.OrderId = purchase.OrderId;
        item.Id = purchase.Id;
        item.Amount = +purchase.Amount;
        item.Method = purchase.Method;
        item.Status = purchase.Status;

        this.showSuccess('Đã cập nhật 1 thanh toán!');

        dismissPurchaseDialog();

      } else {

        this.globalPurchases.push(purchase);
        this.showSuccess('Đã thêm 1 thanh toán!');

        this.currentPurchase.Amount = 0;

        if (this.totalBalance <= 0) {

          dismissPurchaseDialog();

        }

      }

    });

  }

  selectPurType(purchaseType: PurchaseMethods) {

    this.currentPurchase.Method = purchaseType;

    if (purchaseType == PurchaseMethods.Momo && this.currentPurchase.Amount > 0) {

      this.qrContent = this.qrContentTemplate + this.currentPurchase.Amount.toString();

      openQR();

    }

  }

}
