import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItems, PurchaseMethods, PurchaseStatus } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { MyCurrPipe } from 'src/app/pipes/date.pipe';
import { OrderService } from 'src/app/services/order.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';

declare function showPurchaseSetupPopup(): any;
declare function hideAdd(): any;

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent("Thanh toán", MenuItems.Purchase)

  isSelectAll: boolean = false;
  totalCount = 0;
  currentPage = 1;
  purchaseStatusses = PurchaseStatus;
  isUnKnownOnly = false;
  oldOrderId = '';
  curentAddingDate: Date;
  selectedDates: Date[];
  oldAmount = 0;

  _selectedPurchaseStatus: PurchaseStatus = PurchaseStatus.All;
  public get selectedPurchaseStatus(): PurchaseStatus {
    return this._selectedPurchaseStatus;
  }

  public set selectedPurchaseStatus(val: PurchaseStatus) {
    this._selectedPurchaseStatus = val;
    this.pageChanged(1);
  }

  currentPurchase: Purchase;

  purchases: {
    Purchase: Purchase,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number = 10;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {
    this._itemsPerPage = val;

    this.pageChanged(1);
  }

  constructor(private purchaseService: PurchaseService, private orderService: OrderService) {
    super();

    let startTime = new Date();
    startTime.setMilliseconds(0);
    startTime.setSeconds(0);
    startTime.setMinutes(0);
    startTime.setHours(0);
    startTime.setDate(1);

    let endTime = new Date();
    endTime.setMilliseconds(0);
    endTime.setSeconds(0);
    endTime.setMinutes(0);
    endTime.setHours(0);

    this.purchases = [];
    this.currentPurchase = new Purchase();
    this.curentAddingDate = new Date();

    this.selectedDates = [];

    this.selectedDates.push(startTime, endTime);

  }

  protected Init() {
    this.pageChanged(1);
  }

  rangeSelected() {

    this.pageChanged(1);

  }

  savePurchase(form: NgForm) {

    if (!form.valid)
      return;

    this.currentPurchase.Amount = +this.currentPurchase.Amount;

    if (this.currentPurchase.OrderId && this.currentPurchase.OrderId != '') {

      this.orderService.getSingleById(this.currentPurchase.OrderId)
        .then(order => {

          if (order == null) {
            this.showError("Mã đơn không tồn tại!");
            return;
          }

          if (this.oldOrderId == this.currentPurchase.OrderId) {

            if (order.TotalAmount < order.TotalPaidAmount - this.oldAmount + this.currentPurchase.Amount) {
              this.showError("Giá trị tối đa là " + MyCurrPipe.currencyFormat(order.TotalAmount - order.TotalPaidAmount + this.oldAmount));
              return;
            }

          }
          else {

            if (order.TotalAmount < order.TotalPaidAmount + this.currentPurchase.Amount) {
              console.log('heheeheh', order.TotalAmount, order.TotalPaidAmount, this.currentPurchase.Amount);
              this.showError("Giá trị tối đa là " + MyCurrPipe.currencyFormat(order.TotalAmount - order.TotalPaidAmount));
              return;
            }

          }

          this.updatePurchaseRecord();

        });

    } else {

      this.updatePurchaseRecord();

    }
  }

  updatePurchaseRecord() {
    this.currentPurchase.AddingTime = this.curentAddingDate.getTime();

    var promise: Promise<any>;

    if (this.currentPurchase.Id && this.currentPurchase.Id > 0) {
      promise = this.purchaseService.update(this.currentPurchase, this.oldOrderId, this.oldAmount);
    } else {
      promise = this.purchaseService.createOrUpdate(this.currentPurchase, 0);
    }

    promise.then(data => {

      this.pageChanged(this.currentPage);
      hideAdd();

    });

  }

  pageChanged(page: number) {

    this.currentPage = page;

    let endTime = this.selectedDates[1];
    endTime.setDate(endTime.getDate() + 1);

    this.purchaseService.getByStatuses(this._selectedPurchaseStatus === PurchaseStatus.All ? [] : [this._selectedPurchaseStatus], page, this._itemsPerPage, this.selectedDates[0].getTime(), this.selectedDates[1].getTime(), this.isUnKnownOnly)
      .then(data => {

        this.purchases = [];
        this.itemTotalCount = data.totalItemCount;
        this.pageCount = data.totalPages;

        data.items.forEach(purchase => {
          this.purchases.push({
            Purchase: purchase,
            IsChecked: false
          });

        });

      });
  }

  searchPurchase(term: string) {

  }

  getMethodDisplay(method: PurchaseMethods): string {
    switch (method) {
      case PurchaseMethods.Banking:
        return 'Chuyển khoản';
      case PurchaseMethods.Cash:
        return 'Tiền mặt';
      case PurchaseMethods.Momo:
        return 'Ví MOMO';
      default: return '';
    }
  }


  getStatusDisplay(status: PurchaseStatus) {

    switch (status) {
      case PurchaseStatus.Canceled:
        return 'Đã huỷ';
      case PurchaseStatus.Completed:
        return 'Đã hoàn tất';
      case PurchaseStatus.SentBack:
        return 'Đã hoàn trả';
      case PurchaseStatus.Waiting:
        return 'Đang đợi';
      default: return '';
    }
  }

  addRequest() {

    this.currentPurchase = new Purchase();
    this.curentAddingDate = new Date();
    this.oldAmount = 0;
    this.oldOrderId = '';
    showPurchaseSetupPopup();

  }

  editPurchase(purchase: Purchase) {

    Object.assign(this.currentPurchase, purchase);
    this.oldOrderId = this.currentPurchase.OrderId;
    this.curentAddingDate = new Date(this.currentPurchase.AddingTime);
    this.oldAmount = this.currentPurchase.Amount;

    showPurchaseSetupPopup();

  }

  deletePurchase(purchase: Purchase) {

  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.purchases.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

}
