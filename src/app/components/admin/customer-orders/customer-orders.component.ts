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


    this.orderService.getByFieldName('CustomerId', this.customer.Id)
      .then(orders => {

        let task = new Promise(async (resolve, reject) => {

          for (let i = 0; i < orders.length; i++) {

            let orderVM = OrderViewModel.ToViewModel(orders[i], this.customer);

            let orderDetails = await this.orderDetailService.getByFieldName('OrderId', orders[i].Id);

            if (orderDetails.length > 0) {

              orderDetails.forEach(orderDetail => {
                orderVM.OrderDetails.push(OrderDetailViewModel.ToViewModel(orderDetail));
              });

            }

            this.orders.push(orderVM);
          }

          setTimeout(() => {
            resolve();
          }, 200);

        });

        task.then(() => {
          cusOrdersBinding();
        });

      });

  }

  getState(state: OrderDetailStates): string {
    return ORDER_DETAIL_STATES.filter(p => p.State == state)[0].DisplayName;
  }


}
