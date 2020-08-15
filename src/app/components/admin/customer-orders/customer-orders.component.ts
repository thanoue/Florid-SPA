import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, OrderDetailStates } from 'src/app/models/enums';
import { Customer } from 'src/app/models/entities/customer.entity';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';

declare function cusOrdersBinding(): any;

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

  constructor(private orderService: OrderService, private orderDetailService: OrderDetailService) { super(); }

  protected Init() {

    this.orders = [];

    this.orderService.getOrderViewModelsByCusId(this.customer.Id)
      .then(orderVMs => {
        this.orders = orderVMs;
        cusOrdersBinding();
      });
  }

  getState(state: OrderDetailStates): string {
    return ORDER_DETAIL_STATES.filter(p => p.State == state)[0].DisplayName;
  }
}
