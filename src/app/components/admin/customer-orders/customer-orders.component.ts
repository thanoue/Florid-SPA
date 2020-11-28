import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, OrderDetailStates } from 'src/app/models/enums';
import { Customer } from 'src/app/models/entities/customer.entity';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { PrintJob, PrintSaleItem, purchaseItem } from 'src/app/models/entities/printjob.entity';
import { PrintJobService } from 'src/app/services/print-job.service';


@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent extends BaseComponent {

  get customer(): Customer {
    return this.globalCustomer;
  }

  orders: OrderViewModel[];

  protected PageCompnent: PageComponent = new PageComponent('Đơn của khách', MenuItems.Customer);

  constructor(private printJobService: PrintJobService, private orderService: OrderService, private orderDetailService: OrderDetailService) { super(); this.orders = []; }

  protected Init() {
    this.orderService.getOrderViewModelsByCusId(this.customer.Id)
      .then(orderVMs => {
        this.orders = orderVMs;
      });
  }

  getState(state: OrderDetailStates): string {
    return ORDER_DETAIL_STATES.filter(p => p.State == state)[0].DisplayName;
  }

  getDetailDiscount(price: number, percentDiscount: number, amountDidcount: number): number {

    let discount = 0;

    if (percentDiscount && percentDiscount > 0)
      discount = (price / 100) * percentDiscount;

    if (amountDidcount && amountDidcount > 0)
      discount = discount + amountDidcount;

    return discount;
  }

  doPrintJob(order: OrderViewModel) {

    console.log(order);

    let tempSummary = 0;
    const products: PrintSaleItem[] = [];

    order.OrderDetails.forEach(product => {
      products.push({
        productName: product.ProductName,
        index: product.Index + 1,
        price: product.ModifiedPrice,
        additionalFee: product.AdditionalFee,
        discount: this.getDetailDiscount(product.ModifiedPrice, product.PercentDiscount, product.AmountDiscount)
      });
      tempSummary += product.ModifiedPrice;
    });

    let purhases: purchaseItem[] = [];

    if (order.PurchaseItems)
      order.PurchaseItems.forEach(purchase => {

        purhases.push({
          method: purchase.Method,
          amount: purchase.Amount,
          status: purchase.Status
        });

      });

    const orderData: PrintJob = {
      Created: (new Date()).getTime(),
      Id: order.OrderId,
      Active: true,
      IsDeleted: false,
      saleItems: products,
      createdDate: order.CreatedDate.toLocaleString('en-US', { hour12: true }),
      orderId: order.OrderId,
      summary: tempSummary,
      totalAmount: order.TotalAmount,
      totalPaidAmount: order.TotalPaidAmount,
      totalBalance: order.TotalAmount - order.TotalPaidAmount,
      vatIncluded: order.VATIncluded,
      memberDiscount: order.CustomerInfo.DiscountPercent,
      scoreUsed: order.CustomerInfo.ScoreUsed,
      gainedScore: order.CustomerInfo.GainedScore,
      totalScore: order.CustomerInfo.AvailableScore - order.CustomerInfo.ScoreUsed + order.CustomerInfo.GainedScore,
      customerName: order.CustomerInfo.Name,
      discount: this.getDetailDiscount(order.TotalAmount, order.PercentDiscount, order.AmountDiscount),
      purchaseItems: purhases
    };

    this.printJobService.addPrintJob(orderData);
  }
}
