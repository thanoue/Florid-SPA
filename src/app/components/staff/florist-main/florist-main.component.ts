import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { ODFloristInfo, ODSeenUserInfo } from 'src/app/models/entities/order.entity';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;

@Component({
  selector: 'app-florist-main',
  templateUrl: './florist-main.component.html',
  styleUrls: ['./florist-main.component.css']
})
export class FloristMainComponent extends BaseComponent {

  Title = 'Thợ cắm hoa';
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  waitingOrderDetails: OrderDetailViewModel[];
  makingOrderDetails: OrderDetailViewModel[];

  waitingMenuItems = [
    'Nhận đơn',
    'Xem chi tiết đơn',
  ];

  makingMenuItems = [
    'Hoàn thành đơn',
    'Xem chi tiết đơn',
  ];

  protected OnBackNaviage() {
    customerSupport();
  }

  logout() {

    this.authService.logOut(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['staff-login']);
      }

    });
  }

  protected Init() {
    this.loadWaitingDetails();
    this.loadMakingDetails();

    this.askForRememberPassword();
  }

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
    super();
  }

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['staff/order-detail-view']);
  }

  loadWaitingDetails() {

    this.waitingOrderDetails = [];

    this.orderDetailService.getByState(OrderDetailStates.Waiting)
      .then(details => {

        this.waitingOrderDetails = details;
        this.waitingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)

      });
  }

  loadMakingDetails() {

    this.makingOrderDetails = [];

    this.orderDetailService.getByStateAndFloristId(this.CurrentUser.Id, OrderDetailStates.Making)
      .then(details => {

        this.makingOrderDetails = details;
        this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)

      });

  }

  getMenu(orderDetail: OrderDetailViewModel) {

    menuOpen((index) => {

      switch (+index) {
        case 0:

          switch (orderDetail.State) {
            case OrderDetailStates.Waiting:

              this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
                .then(data => {

                  this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
                    State: OrderDetailStates.Making,
                    MakingSortOrder: 0,
                    FloristId: this.CurrentUser.Id,
                    MakingStartTime: (new Date).getTime()
                  }).then(() => {
                    this.loadMakingDetails();
                    this.loadWaitingDetails();
                  });

                });

              break;
            case OrderDetailStates.Making:

              this.openConfirm('chắc chắn hoàn thành đơn?', () => {

                this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
                  State: OrderDetailStates.Comfirming,
                  MakingCompletedTime: (new Date).getTime()
                }).then(() => {
                  this.loadMakingDetails();
                  this.loadWaitingDetails();
                });

              })

              break;
          }
          break;
        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);

          break;

      }
    }, orderDetail.State === OrderDetailStates.Waiting ? this.waitingMenuItems : this.makingMenuItems);
  }
}
