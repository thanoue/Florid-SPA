import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, Roles, MakingType } from 'src/app/models/enums';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { ODSeenUserInfo } from 'src/app/models/entities/order.entity';

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

  fixingRequestMenuItems = [
    'Nhận sửa đơn',
    'Xem chi tiết đơn',
  ];

  asignedMenuItems = [
    'Bắt đầu làm/sửa',
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
        this.router.navigate(['staff/login']);
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

    this.orderDetailService.getByStates([OrderDetailStates.Waiting, OrderDetailStates.FixingRequest], 'MakingRequestTime')
      .then(details => {

        this.waitingOrderDetails = details;

      });
  }

  loadMakingDetails() {

    this.makingOrderDetails = [];

    this.orderDetailService.getMakingOrderDetails(this.CurrentUser.Id)
      .then(details => {

        this.makingOrderDetails = details;

      });

  }

  getMenu(orderDetail: OrderDetailViewModel) {

    let menu: string[];

    switch (orderDetail.State) {
      case OrderDetailStates.Waiting:
        menu = this.waitingMenuItems;
        break;
      case OrderDetailStates.Making:
      case OrderDetailStates.Fixing:
        menu = this.makingMenuItems;
        break;
      case OrderDetailStates.FixingRequest:
        menu = this.fixingRequestMenuItems;
        break;

      case OrderDetailStates.FixerAssigned:
      case OrderDetailStates.FloristAssigned:

        menu = this.asignedMenuItems;
        break;
    }

    menuOpen((index) => {

      switch (+index) {
        case 0:

          switch (orderDetail.State) {

            case OrderDetailStates.FixerAssigned:
            case OrderDetailStates.FloristAssigned:

              this.openConfirm('Bắt đầu thực hiện đơn này?', () => {

                this.orderDetailService.updateMakingFields(this.orderDetailService.getLastestMaking(orderDetail).Id, {
                  StartTime: (new Date()).getTime(),
                }).then(() => {

                  this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                    State: orderDetail.State == OrderDetailStates.FixerAssigned ? OrderDetailStates.Fixing : OrderDetailStates.Making,

                  }).then(() => {

                    this.loadMakingDetails();

                  });

                });

              });

              break;


            case OrderDetailStates.FixingRequest:
            case OrderDetailStates.Waiting:

              this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
                .then(data => {

                  let typeMaking = MakingType.Making;

                  if (orderDetail.State == OrderDetailStates.Waiting) {
                    typeMaking = MakingType.Making;
                  } else {
                    typeMaking = MakingType.Fixing;
                  }

                  this.orderDetailService.assignSingleMaking(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime(), typeMaking).then(() => {
                    this.loadMakingDetails();
                    this.loadWaitingDetails();
                  });

                });

              break;

            case OrderDetailStates.Making:
            case OrderDetailStates.Fixing:

              this.openConfirm('chắc chắn hoàn thành đơn?', () => {

                this.orderDetailService.updateMakingFields(this.orderDetailService.getLastestMaking(orderDetail).Id, {
                  CompleteTime: (new Date()).getTime(),
                }).then(() => {

                  this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                    State: orderDetail.State == OrderDetailStates.Comfirming,

                  }).then(() => {
                    this.loadMakingDetails();
                    this.loadWaitingDetails();
                  });

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
    }, menu);
  }
}
