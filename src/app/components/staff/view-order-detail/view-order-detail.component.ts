import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel, OrderViewModel } from 'src/app/models/view.models/order.model';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { ODSeenUserInfo } from 'src/app/models/entities/order.entity';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { User } from 'src/app/models/entities/user.entity';

declare function openViewed(): any;

@Component({
  selector: 'app-view-order-detail',
  templateUrl: './view-order-detail.component.html',
  styleUrls: ['./view-order-detail.component.css']
})
export class ViewOrderDetailComponent extends BaseComponent {

  Title = 'Chi tiết đơn';
  IsDataLosingWarning = false;
  orderDetail: OrderDetailViewModel;
  state: string;
  states = OrderDetailStates;
  canSeen = true;
  order: OrderViewModel;

  constructor(private orderDetailService: OrderDetailService) {
    super();
    console.log(this.globalOrder);
    this.orderDetail = new OrderDetailViewModel();
    this.orderDetail.SeenUsers = [];
    this.order = new OrderViewModel();
  }

  protected Init() {

    this.orderDetail = this.globalOrderDetail;
    this.order = this.globalOrder;

    this.state = ORDER_DETAIL_STATES.filter(p => p.State === this.orderDetail.State)[0].DisplayName;

    setTimeout(() => {

      if (!this.canSeen)
        return;

      if (this.CurrentUser.Role == Roles.Florist || this.CurrentUser.Role === Roles.Shipper) {

        this.orderDetailService.updateDetailSeen(this.orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime(), false).then(res => {

        });

      }
    }, 2000);

  }

  protected destroy() {
    this.canSeen = false;
  }

  openViewed() {

    this.orderDetailService.getODSeeners(this.orderDetail.OrderDetailId)
      .then(detail => {
        this.orderDetail.SeenUsers = detail;
        openViewed();
      });

  }

}
