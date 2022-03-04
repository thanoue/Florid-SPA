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
    'Hoàn thành đơn',
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

    this.orderDetailService.getDetailWithTimeSort([OrderDetailStates.Added, OrderDetailStates.SentBack], 'MakingRequestTime')
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

  completeOD(orderDetail: OrderDetailViewModel) {

    this.openConfirm('chắc chắn hoàn thành đơn?', () => {

      this.orderDetailService.updateMakingFields(this.orderDetailService.getLastestMaking(orderDetail).Id, {
        CompleteTime: (new Date()).getTime(),
      }).then(() => {

        this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

          State: OrderDetailStates.Comfirming,

        }).then(() => {
          this.loadMakingDetails();
          this.loadWaitingDetails();
        });

      });

    });
  }

  getMenu(orderDetail: OrderDetailViewModel) {

    console.log(orderDetail.State);

    let menu: string[];

    switch (orderDetail.State) {
      case OrderDetailStates.Added:
      case OrderDetailStates.SentBack:
        menu = this.waitingMenuItems;
        break;
      case OrderDetailStates.Making:
      case OrderDetailStates.Fixing:
        menu = this.makingMenuItems;
        break;
    }

    menuOpen((index) => {

      switch (+index) {

        case 0:

          switch (orderDetail.State) {

            case OrderDetailStates.Added:
            case OrderDetailStates.SentBack:

              this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
                .then(data => {

                  let typeMaking = MakingType.Making;

                  if (orderDetail.State == OrderDetailStates.Added) {
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

              this.completeOD(orderDetail);

              break;

          }
          break;

        case 1:

          switch (orderDetail.State) {

            case OrderDetailStates.Added:
            case OrderDetailStates.SentBack:

              this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
                .then(data => {

                  let typeMaking = MakingType.Making;

                  if (orderDetail.State == OrderDetailStates.Added) {
                    typeMaking = MakingType.Making;
                  } else {
                    typeMaking = MakingType.Fixing;
                  }

                  this.orderDetailService.assignSingleMaking(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime(), typeMaking).then((making) => {

                    this.orderDetailService.updateMakingFields(making.Id, {
                      CompleteTime: (new Date()).getTime(),
                    }).then(() => {

                      this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                        State: OrderDetailStates.Comfirming,

                      }).then(() => {
                        this.loadMakingDetails();
                        this.loadWaitingDetails();
                      });

                    });

                  });

                });

              break;

            default:

              this.globalOrderDetail = orderDetail;
              this.router.navigate(['staff/order-detail-view']);

              break;
          }
          break;

        case 2:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);

          break;

      }
    }, menu);
  }
}
