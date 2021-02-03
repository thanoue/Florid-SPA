import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';
import { browser } from 'protractor';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;
declare function getShippingNoteDialog(btnTitle: string, callback: (note: string) => void): any;
declare function getNumberValidateInput(resCallback: (res: number, validCallback: (isvalid: boolean, error: string) => void) => void, placeHolder: string, oldValue: number): any;

@Component({
  selector: 'app-shipper-main',
  templateUrl: './shipper-main.component.html',
  styleUrls: ['./shipper-main.component.css']
})
export class ShipperMainComponent extends BaseComponent {

  Title = "Người giao hàng";
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  waitingOrderDetails: OrderDetailViewModel[];
  shippingOrderDetails: OrderDetailViewModel[];

  waitingMenuItems = [
    'Nhận đơn',
    'Xem chi tiết đơn',
  ];

  shippingMenuItems = [
    'Giao đơn',
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

    this.orderDetailService.getByState(OrderDetailStates.DeliveryWaiting, 'ReceivingTime')
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

      this.orderDetailService.updateShippingFields(this.orderDetailService.getLastestShipping(orderDetail).Id, {
        CompleteTime: (new Date()).getTime(),
        Note: note
      }).then(data => {

        this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

          State: destState

        }).then(res => {

          this.loadShippingDetails();

        });
      });

    });

  }

  getMenu(orderDetail: OrderDetailViewModel) {

    menuOpen((index) => {

      switch (+index) {
        case 0:

          switch (orderDetail.State) {

            case OrderDetailStates.DeliveryWaiting:

              this.orderDetailService.updateDetailSeen(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date).getTime())
                .then(data => {

                  this.orderDetailService.assignSingleOD(orderDetail.OrderDetailId, this.CurrentUser.Id, (new Date()).getTime()).then(() => {

                    this.loadShippingDetails();
                    this.loadWaitingDetails();

                  });

                });

              break;

            case OrderDetailStates.OnTheWay:

              this.openConfirm('Hoàn thành giao đơn?', () => {

                this.updateFinalState(orderDetail, 'Hoàn thành', OrderDetailStates.Deliveried);

              });

              break;

            case OrderDetailStates.DeliverAssinged:

              this.openConfirm('Bắt đầu giao đơn này?', () => {

                this.orderDetailService.updateShippingFields(this.orderDetailService.getLastestShipping(orderDetail).Id, {
                  StartTime: (new Date()).getTime(),
                }).then(() => {

                  this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                    State: OrderDetailStates.OnTheWay,

                  }).then(() => {

                    this.loadShippingDetails();

                  });

                });

              });

              break;
          }

          break;

        case 1:

          switch (orderDetail.State) {

            case OrderDetailStates.OnTheWay:

              this.globalOrderDetail = orderDetail;
              this.router.navigate(['staff/customer-confirming']);

              break;

            default:

              this.globalOrderDetail = orderDetail;
              this.router.navigate(['staff/order-detail-view']);

              break;
          }

          break;

        case 2:

          this.openConfirm('Trả đơn này?', () => {

            this.updateFinalState(orderDetail, 'Trả đơn', OrderDetailStates.SentBack);

          });

          break;

        case 3:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);

          break;

      }
    }, orderDetail.State === OrderDetailStates.DeliveryWaiting ? this.waitingMenuItems : orderDetail.State === OrderDetailStates.DeliverAssinged ? this.shippingMenuItems : this.onTheWayMenuItems);

  }
}
