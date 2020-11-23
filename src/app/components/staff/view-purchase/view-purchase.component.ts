import { Component } from '@angular/core';
import { PurchaseMethods, PurchaseStatus } from 'src/app/models/enums';
import { OrderViewModel } from 'src/app/models/view.models/order.model';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';

declare function openQR(): any;
declare function moveCursor(id: string, pos: number);
declare function purchaseDoing(): any;
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
  currentPurType: PurchaseMethods;
  purchaseType = PurchaseMethods;
  currentPurStatus: PurchaseStatus;
  protected IsDataLosingWarning = false;
  qrContent: string;
  currentPayAmount: number;
  qrContentTemplate = "";
  totalBalance = 0;

  constructor(private purchaseService: PurchaseService) {
    super();
    this.purchaseItems = [];
    this.order = this.globalOrder;
    this.currentPurType = PurchaseMethods.Cash;
    this.qrContent = "";
    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
  }

  protected Init() {
    this.purchaseItems = this.globalPurchases;

  }

  selectItem(purchase: Purchase) {
    if (purchase.Status == PurchaseStatus.Waiting) {
      this.openConfirm('Xác nhận đã nhận tiền?', () => {

        this.purchaseService.updateStatus(purchase.Id, PurchaseStatus.Completed)
          .then(data => {
            purchase.Status = PurchaseStatus.Completed;
          });

      });
    }
  }

  addPurchase() {

    this.currentPayAmount = this.totalBalance;
    this.currentPurType = PurchaseMethods.Cash;
    this.currentPurStatus = PurchaseStatus.Completed;

    purchaseDoing();
  }

  onPayChanged(value) {
    this.onPayFocus();
  }

  onPayFocus() {

    if (!this.currentPayAmount) {
      this.currentPayAmount = 0;
    }

    if (this.currentPayAmount < 1000) {
      this.currentPayAmount *= 1000;
    }

    var length = this.currentPayAmount.toString().length;

    setTimeout(() => {
      moveCursor('currentPayAmount', length - 3);
    }, 10);

  }

  purchaseConfirm() {

    if (this.currentPayAmount > this.totalBalance || this.currentPayAmount <= 0) {
      this.showError('Số tiền không hợp lệ!');
      return;
    }

    let purchase = new Purchase();

    purchase.OrderId = this.order.OrderId;
    purchase.Amount = +this.currentPayAmount;
    purchase.Method = this.currentPurType;
    purchase.Status = this.currentPurStatus;

    this.order.TotalPaidAmount += purchase.Amount;

    this.purchaseService.create(purchase, this.order.TotalPaidAmount).then(item => {

      this.globalPurchases.push(purchase);

      this.currentPayAmount = 0;

      this.showSuccess('Đã thêm 1 thanh toán!');

      this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

      if (this.totalBalance <= 0) {

        dismissPurchaseDialog();

      } else {

        this.currentPayAmount = this.totalBalance;
        this.currentPurType = PurchaseMethods.Cash;
        this.currentPurStatus = PurchaseStatus.Completed;

      }

    });

  }

  selectPurType(purchaseType: PurchaseMethods) {

    this.currentPurType = purchaseType;

    if (purchaseType == PurchaseMethods.Momo && this.currentPayAmount > 0) {

      this.qrContent = this.qrContentTemplate + this.currentPayAmount.toString();

      openQR();

    }

  }

}
