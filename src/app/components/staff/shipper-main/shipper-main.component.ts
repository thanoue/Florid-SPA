import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { ODSeenUserInfo, ODShipperInfo } from 'src/app/models/entities/order.entity';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;

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
    'Hoàn thành đơn',
    'Xem chi tiết đơn',
  ];

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
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
        this.router.navigate(['staff-login']);
      }

    });
  }

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['staff/order-detail-view']);
  }

  loadWaitingDetails() {

    this.waitingOrderDetails = [];

    this.orderDetailService.getByState(OrderDetailStates.DeliveryWaiting)
      .then(details => {

        this.waitingOrderDetails = details;
        this.waitingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)

      });
  }

  loadShippingDetails() {

    this.shippingOrderDetails = [];

    this.orderDetailService.getShippingOrderDetails(this.CurrentUser.Id)
      .then(details => {

        this.shippingOrderDetails = details;
        this.shippingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)

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
            case OrderDetailStates.Delivering:

              this.openConfirm('Hoàn thành giao đơn?', () => {

                this.globalOrderDetail = orderDetail;
                this.router.navigate(['staff/order-detail-confirming']);

              })

              break;
          }
          break;
        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);

          break;

      }
    }, orderDetail.State === OrderDetailStates.DeliveryWaiting ? this.waitingMenuItems : this.shippingMenuItems);

  }
}
