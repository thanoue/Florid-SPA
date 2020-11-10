import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MenuItems } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { SaleTotalModel } from 'src/app/models/view.models/sale.total.model';
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
  discountTotal: number;
  amountTotal: number;
  finalTotal: number;

  constructor(private orderService: OrderService) {
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

  resetSummary(){
    this.priceTotal = 0;
    this.feeTotal = 0;
    this.discountTotal = 0;
    this.amountTotal = 0;
    this.finalTotal = 0;
  }

  getItems() {

    this.saleItems = [];

    this.resetSummary();

    this.orderService.getSaleTotalByRange([this.selectedDates[0].getTime(), this.selectedDates[1].getTime()])
      .then(data => {

        if (data == null)
          return;

        this.saleItems = data;

        this.saleItems.forEach(saleItem => {

          this.priceTotal += saleItem.PriceTotal;
          this.feeTotal += saleItem.FeeTotal;
          this.discountTotal += saleItem.DiscountTotal;
          this.amountTotal += saleItem.AmountTotal;
          this.finalTotal += saleItem.FinalTotal;

        })

      });

  }

  rangeSelected() {
    this.getItems();
  }

}
