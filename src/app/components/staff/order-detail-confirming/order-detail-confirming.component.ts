import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { Router } from '@angular/router';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';

@Component({
  selector: 'app-order-detail-confirming',
  templateUrl: './order-detail-confirming.component.html',
  styleUrls: ['./order-detail-confirming.component.css']
})
export class OrderDetailConfirmingComponent extends BaseComponent {

  Title = 'Xác nhận thành phẩm';
  protected IsDataLosingWarning = false;
  orderDetail: OrderDetailViewModel;

  protected Init() {
    this.orderDetail = this.globalOrderDetail;

  }

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
    super();
  }

  gotToCusConfirm() {
    this.router.navigate(['staff/customer-confirming']);
  }

  confirm() {
    switch (this.CurrentUser.Role) {

      case Roles.Account:
      case Roles.Admin:

        this.orderDetailService.resultConfirm(this.globalOrderDetail.OrderDetailId, this.orderDetailService.getLastestMaking(this.globalOrderDetail).Id, null)
          .then(() => {

            this.router.navigate(['staff/account-main']);

          });

        break;
      case Roles.Shipper:

        this.orderDetailService.updateFields(this.globalOrderDetail.OrderDetailId, {
          State: OrderDetailStates.Completed,
          // tslint:disable-next-line:new-parens
          DeliveryCompletedTime: (new Date).getTime(),
        })
          .then(() => {

            this.router.navigate(['staff/shipper-main']);

          });

        break;

      default:
        break;
    }
  }
}
