import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItems, PurchaseMethods } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { MyCurrPipe } from 'src/app/pipes/date.pipe';
import { OrderService } from 'src/app/services/order.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';
import { Customer } from '../../../models/entities/customer.entity';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';

declare function showPurchaseSetupPopup(): any;
declare function hideAdd(): any;

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Thanh toán', MenuItems.Purchase)

  isSelectAll = false;
  totalCount = 0;
  currentPage = 1;
  isUnKnownOnly = false;
  oldOrderId = '';
  searchTerm = '';
  curentAddingDate: Date;
  selectedDates: Date[];
  oldAmount = 0;

  currentPurchase: Purchase;

  purchases: {
    Purchase: Purchase,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  itemsPerPage = 10;

  get itemPerpage(): number {
    return this.itemsPerPage;
  }

  set itemPerpage(val: number) {
    this.itemsPerPage = val;
    this.pageChanged(1);
  }

  purchaseType = PurchaseMethods.All;

  get purchaseMethod(): PurchaseMethods {
    return this.purchaseType;
  }

  set purchaseMethod(val: PurchaseMethods) {

    this.purchaseType = val;

    this.pageChanged(1);

  }

  constructor(private router: Router, private purchaseService: PurchaseService, private orderService: OrderService, private customerService: CustomerService) {
    super();

    const startTime = new Date();
    startTime.setMilliseconds(0);
    startTime.setSeconds(0);
    startTime.setMinutes(0);
    startTime.setHours(0);
    startTime.setDate(1);

    const endTime = new Date();
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

    if (!form.valid) {
      return;
    }

    this.currentPurchase.Amount = +this.currentPurchase.Amount;

    if (this.currentPurchase.OrderId && this.currentPurchase.OrderId !== '') {

      this.orderService.getSingleById(this.currentPurchase.OrderId)
        .then(order => {

          if (order == null) {
            this.showError('Mã đơn không tồn tại!');
            return;
          }

          if (this.oldOrderId === this.currentPurchase.OrderId) {

            if (order.TotalAmount < order.TotalPaidAmount - this.oldAmount + this.currentPurchase.Amount) {
              this.showError('Giá trị tối đa là ' + MyCurrPipe.currencyFormat(order.TotalAmount - order.TotalPaidAmount + this.oldAmount));
              return;
            }

          } else {

            if (order.TotalAmount < order.TotalPaidAmount + this.currentPurchase.Amount) {
              this.showError('Giá trị tối đa là ' + MyCurrPipe.currencyFormat(order.TotalAmount - order.TotalPaidAmount));
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

    let promise: Promise<any>;

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

    const endTime = this.selectedDates[1];

    endTime.setDate(endTime.getDate() + 1);

    this.purchaseService.getByTerm(this.searchTerm, page, this.itemsPerPage, this.selectedDates[0].getTime(), this.selectedDates[1].getTime(), this.isUnKnownOnly, this.purchaseMethod)
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
    this.searchTerm = term;
    this.pageChanged(1);
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

  viewCusDetail(customerInfo: Customer) {

    if (customerInfo) {

      this.customerService.getById(customerInfo.Id)
        .then((cus) => {
          this.globalCustomer = cus;
          this.router.navigate(['admin/customer-detail']);
        });
    }
  }

  deletePurchase(purchase: Purchase) {

    this.openConfirm('Chắc chắn muốn xoá thanh toánn này?', () => {

      this.purchaseService.delete(purchase.Id)
        .then(() => {
          this.pageChanged(1);
        });

    });

  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.purchases.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

}
