import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/entities/customer.entity';
import { Order } from 'src/app/models/entities/order.entity';
import { MenuItems, PurchaseMethods } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { OrderCustomerInfoViewModel, OrderDetailViewModel, OrderViewModel } from 'src/app/models/view.models/order.model';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';

declare function showDebtSetupPopup(): any;
declare function hideAdd(): any;
declare function showPurchaseSetupPopup(): any;

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css']
})
export class DebtsComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent("Công nợ", MenuItems.Debts)

  _itemsPerPage: number = 10;
  get itemPerpage(): number {
    return this._itemsPerPage;
  }
  set itemPerpage(val: number) {
    this._itemsPerPage = val;

    this.pageChanged(1);
  }
  currentPage = 1;
  pageCount = 0;
  itemTotalCount = 0;

  _purchaseItemsPerPage: number = 5;
  get purchaseItemPerpage(): number {
    return this._purchaseItemsPerPage;
  }
  set purchaseItemPerpage(val: number) {
    this._purchaseItemsPerPage = val;

    this.purchasePageChanged(1);
  }
  purchaseCurrentPage = 1;
  purchasePageCount = 0;
  purchaseItemTotalCount = 0;

  purchaseSelectedDates: Date[];
  newPurchase: Purchase;
  newPurchaseAddingTime: Date;
  purchases: Purchase[];

  selectedDates: Date[];
  oldAmount = 0;
  currentOrder: OrderViewModel;
  orders: {
    Order: OrderViewModel,
    IsChecked: boolean
  }[];

  constructor(private router: Router,
    private customerService: CustomerService,
    private orderService: OrderService,
    private purchaseService: PurchaseService) {
    super();

    this.newPurchase = new Purchase();
    this.newPurchaseAddingTime = new Date();

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

    this.orders = [];

    this.selectedDates = [];

    this.selectedDates.push(startTime, endTime);
    this.purchaseSelectedDates = [];

    this.purchaseSelectedDates.push(startTime, endTime);

    this.currentOrder = new OrderViewModel();
  }

  protected Init() {
    this.pageChanged(1);
    this.purchasePageChanged(1);
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

  selectPurchase(order: OrderViewModel) {
    this.currentOrder = order;
    showDebtSetupPopup();
  }

  addNewPurchase(order: OrderViewModel) {

    this.currentOrder = order;

    this.newPurchase = new Purchase();
    this.newPurchase.OrderId = order.OrderId;
    this.newPurchaseAddingTime = new Date();
    this.newPurchase.Method = PurchaseMethods.Banking;

    showPurchaseSetupPopup();

  }

  savePurchase(form: NgForm) {

    if (!form.valid)
      return;

    setTimeout(() => {

      this.newPurchase.Amount = +this.newPurchase.Amount;

      if (this.newPurchase.Amount + this.currentOrder.TotalPaidAmount > this.currentOrder.TotalAmount) {

        this.showError('Thanh toán vượt quá thành tiền!');
        return;

      }

      this.newPurchase.AddingTime = this.newPurchaseAddingTime.getTime();

      this.purchaseService.addAndAssign(this.newPurchase)
        .then(res => {

          this.currentOrder = new OrderViewModel();

          hideAdd();
          this.pageChanged(1);
        });

    }, 10);

  }

  rangeSelected() {
    this.pageChanged(1);
  }

  purchaseRangeSelected() {
    this.purchasePageChanged(1);
  }

  viewCusDetail(customerInfo: OrderCustomerInfoViewModel) {

    if (customerInfo) {

      this.customerService.getById(customerInfo.Id)
        .then((cus) => {
          this.globalCustomer = cus;
          this.router.navigate(['admin/customer-detail']);
        })
    }
  }

  purchasePageChanged(page: number) {

    this.purchaseCurrentPage = page;

    let endTime = this.purchaseSelectedDates[1];
    endTime.setDate(endTime.getDate() + 1);

    this.purchases = [];

    this.purchaseService.getByTerm('', this.purchaseCurrentPage, this._purchaseItemsPerPage, this.purchaseSelectedDates[0].getTime(), this.purchaseSelectedDates[1].getTime(), true)
      .then(data => {

        this.purchaseItemTotalCount = data.totalItemCount;
        this.purchasePageCount = data.totalPages;

        data.items.forEach(purchase => {
          this.purchases.push(purchase);
        });

      });
  }

  assignPurchase(purchase: Purchase) {

    this.purchaseService.assignToOrder(purchase.Id, this.currentOrder.OrderId, purchase.Amount)
      .then(() => {
        hideAdd();
        this.Init();
      });

  }

  pageChanged(page: number) {

    this.currentPage = page;

    let endTime = this.selectedDates[1];
    endTime.setDate(endTime.getDate() + 1);

    this.orders = [];

    this.orderService.getDebtOrders(page, this._itemsPerPage, this.selectedDates[0].getTime(), this.selectedDates[1].getTime())
      .then(data => {

        this.itemTotalCount = data.totalItemCount;
        this.pageCount = data.totalPages;

        data.orders.forEach(order => {
          this.orders.push({
            Order: order,
            IsChecked: false
          });

        });

      });
  }
}
