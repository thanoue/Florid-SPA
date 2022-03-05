import { Component, OnInit, NgProbeToken } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;
declare function getShippingNoteDialog(btnTitle: string, callback: (note: string) => void): any;

@Component({
  selector: 'app-shipper-main',
  templateUrl: './shipper-main.component.html',
  styleUrls: ['./shipper-main.component.css']
})
export class ShipperMainComponent extends BaseComponent {

  Title = 'Người giao hàng';
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  waitingOrderDetails: OrderDetailViewModel[];
  shippingOrderDetails: OrderDetailViewModel[];

  selectDeliveryTime = '';
  selectReceiveRequestTime: Date;
  shippingNote = '';

  waitingMenuItems = [
    'Nhận đơn',
    'Xem chi tiết đơn',
  ];

  onTheWayMenuItems = [
    'Hoàn thành đơn',
    'Chụp ảnh giao hàng',
    'Trả hàng',
    'Xem chi tiết đơn'
  ];

  constructor(private router: Router, private orderService: OrderService, private orderDetailService: OrderDetailService) {
    super();
    this.waitingOrderDetails = [];
    this.shippingOrderDetails = [];
  }

  protected Init() {

    this.loadWaitingDetails();
    this.loadShippingDetails();

    this.askForRememberPassword();

  }

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

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['staff/order-detail-view']);
  }

  loadWaitingDetails() {

    this.waitingOrderDetails = [];

    this.orderDetailService.getDetailWithTimeSort([OrderDetailStates.Comfirming, OrderDetailStates.SentBack], 'ReceivingTime')
      .then(details => {

        this.waitingOrderDetails = details;

      });
  }

  loadShippingDetails() {

    this.shippingOrderDetails = [];

    this.orderDetailService.getShippingOrderDetails(this.CurrentUser.Id)
      .then(details => {

        this.shippingOrderDetails = details;

      });
  }

  updateFinalState(orderDetail: OrderDetailViewModel, btnTitl: string, destState: OrderDetailStates) {

    getShippingNoteDialog(btnTitl, (note) => {

      if (destState === OrderDetailStates.SentBack) {

        this.orderDetailService.updateShippingFields(this.orderDetailService.getLastestShipping(orderDetail).Id, {
          Note: note,
          CompleteTime: new Date().getTime(),
          DeliveryImageUrl: ''

        }).then(data => {

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

            State: OrderDetailStates.SentBack

          }).then(res => {

            this.loadShippingDetails();

          });

        }).catch(err => {

          this.showError(err);

        });

      } else {

        this.orderService.getById(orderDetail.OrderId)
          .then(order => {
            this.orderDetailService.shippingConfirm(orderDetail, null, note).then(data => {

              this.orderDetailService.completeOD(orderDetail, order)
                .then(() => {

                  this.loadShippingDetails();

                });

            }).catch(err => {

              this.showError(err);

            });
          });
      }

    });

  }

  updateWaitingDetail(index: number, orderDetail: OrderDetailViewModel) {

    switch (index) {
      case 0:

        this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
          .then(data => {

            this.orderDetailService.assignSingleShipper(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date()).getTime()).then(() => {

              this.loadShippingDetails();
              this.loadWaitingDetails();

            });

          });

        break;


      case 1:

        this.viewDetail(orderDetail);

        break;
    }

  }

  updateOnTheWayDetail(index: number, orderDetail: OrderDetailViewModel) {

    // onTheWayMenuItems = [
    //   'Hoàn thành đơn',
    //   'Chụp ảnh giao hàng',
    //   'Trả hàng',
    //   'Xem chi tiết đơn'
    // ];

    switch (index) {

      case 0:

        this.openConfirm('Hoàn thành giao đơn?', () => {

          this.updateFinalState(orderDetail, 'Hoàn thành', OrderDetailStates.Completed);

        });

        break;

      case 1:

        this.globalOrderDetail = orderDetail;
        this.router.navigate(['staff/customer-confirming']);

        break;

      case 2:
        this.openConfirm('Trả đơn này?', () => {

          this.updateFinalState(orderDetail, 'Trả đơn', OrderDetailStates.SentBack);

        });

        break;

      case 3:

        this.viewDetail(orderDetail);

        break;
    }

  }

  getMenu(orderDetail: OrderDetailViewModel) {

    let menu: string[];

    switch (orderDetail.State) {
      case OrderDetailStates.Comfirming:
      case OrderDetailStates.SentBack:
        menu = this.waitingMenuItems;
        break;
      case OrderDetailStates.OnTheWay:
        menu = this.onTheWayMenuItems;
        break;
    }

    menuOpen((index) => {

      switch (orderDetail.State) {
        case OrderDetailStates.OnTheWay:

          this.updateOnTheWayDetail(+index, orderDetail);

          break;

        default:

          this.updateWaitingDetail(+index, orderDetail);
      }

    }, menu);

  }
}
