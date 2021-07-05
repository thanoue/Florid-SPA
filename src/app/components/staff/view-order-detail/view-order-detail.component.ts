import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel, OrderViewModel } from 'src/app/models/view.models/order.model';
import { ORDER_DETAIL_STATES, ImgType } from 'src/app/app.constants';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { ODSeenUserInfo } from 'src/app/models/entities/order.entity';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { User } from 'src/app/models/entities/user.entity';
import { ExchangeService } from 'src/app/services/common/exchange.service';
import { ImgPipe } from 'src/app/pipes/img.pipe';
import { OrderService } from 'src/app/services/order.service';

declare function viewImages(onCancel: () => void): any;
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
  noteImgs: string[];

  constructor(private orderDetailService: OrderDetailService, private orderService: OrderService) {
    super();
    this.orderDetail = new OrderDetailViewModel();
    this.orderDetail.SeenUsers = [];
    this.order = new OrderViewModel();
    this.noteImgs = [];
  }

  protected Init() {

    this.orderDetail = this.globalOrderDetail;

    this.orderService.getById(this.orderDetail.OrderId)
      .then(order => {

        if (order != null){
          this.order = order;
        }

      });

    this.state = ORDER_DETAIL_STATES.filter(p => p.State === this.orderDetail.State)[0].DisplayName;

    this.orderDetail.NoteImages.forEach(noteImg => {

      this.noteImgs.push(ImgPipe.getImgUrl(noteImg, ImgType.NoteImg));

    });

    setTimeout(() => {

      if (!this.canSeen)
        return;

      if (this.CurrentUser.Role === Roles.Florist || this.CurrentUser.Role === Roles.Shipper) {

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

  openNoteImages() {

    if (this.orderDetail.NoteImages.length > 0) {

      viewImages(() => {

      });

    }


  }

}
