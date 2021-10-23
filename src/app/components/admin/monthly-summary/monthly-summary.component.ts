import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItems, PurchaseMethods } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { OrderCustomerInfoViewModel } from 'src/app/models/view.models/order.model';
import { SaleTotalModel } from 'src/app/models/view.models/sale.total.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css']
})
export class MonthlySummaryComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent("Doanh thu Tháng", MenuItems.Summary);

  selectedDates: Date[];

  saleItems: SaleTotalModel[];
  searchTerm = '';

  priceTotal: number;
  feeTotal: number;
  paidTotal: number;
  amountTotal: number;
  finalTotal: number;

  _purchaseType = PurchaseMethods.All;

  get purchaseMethod(): PurchaseMethods {
    return this._purchaseType;
  }

  set purchaseMethod(val: PurchaseMethods) {

    this._purchaseType = val;

    this.getItems();

  }


  constructor(
    private router: Router,
    private customerService: CustomerService,
    private orderService: OrderService) {
    super();

    this.selectedDates = [];

    let startDate = new Date();
    startDate.setDate(1);

    this.selectedDates.push(startDate, new Date());

    this.saleItems = [];

    this.resetSummary();
  }

  protected Init() {
    this.getItems();
  }


  viewCusDetail(customerId: string) {

    this.customerService.getById(customerId)
      .then((cus) => {
        this.globalCustomer = cus;
        this.router.navigate(['admin/customer-detail']);
      });
  }

  resetSummary() {
    this.priceTotal = 0;
    this.feeTotal = 0;
    this.paidTotal = 0;
    this.amountTotal = 0;
    this.finalTotal = 0;
  }

  getItems() {

    this.saleItems = [];

    this.resetSummary();

    this.orderService.getSaleTotalByRange([this.selectedDates[0].getTime(), this.selectedDates[1].getTime()], this.purchaseMethod)
      .then(data => {

        if (data == null)
          return;

        this.saleItems = data;

        this.saleItems.forEach(saleItem => {

          this.priceTotal += saleItem.PriceTotal;
          this.feeTotal += saleItem.FeeTotal;
          this.paidTotal += saleItem.TotalPaidAmount;
          this.amountTotal += saleItem.AmountTotal;
          this.finalTotal += saleItem.FinalTotal;

        })

      });

  }

  rangeSelected() {
    this.getItems();
  }

}
