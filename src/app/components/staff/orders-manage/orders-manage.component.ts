import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel, OrderCustomerInfoViewModel } from '../../../models/view.models/order.model';
import { OrderDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailStates } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { StorageService } from 'src/app/services/storage.service';
import { ProductService } from 'src/app/services/product.service';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { shareReplay, timeout } from 'rxjs/operators';
import { rejects } from 'assert';
import { read } from 'fs';

declare function menuOpen(callBack: (index: any) => void, items: string[]): any;
declare function openColorBoard(): any;
declare function customerSupport(): any;
declare function makingTimeRequest(callBack: () => void): any;
declare function saveFile(url, productId, callback: () => void): any;
declare function filterOrderByState(menuitems: { Name: string; Value: number; }[], callback: (val: any) => void): any;

export interface ISelectedDetail {
  FloristName: string;
  State: OrderDetailStates;
  StateDisplay: string;
  ShipperName: string;
}

@Component({
  selector: 'app-orders-manage',
  templateUrl: './orders-manage.component.html',
  styleUrls: ['./orders-manage.component.css']
})
export class OrdersManageComponent extends BaseComponent {


  Title = 'Danh sách đơn';
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  selectDeliveryTime: string;
  selectMakingRequestTime: Date;
  orders: OrderViewModel[];
  states = OrderDetailStates;
  makingNote: string;

  selectedDetail = {} as ISelectedDetail;

  protected OnBackNaviage() {
    customerSupport();
  }

  constructor(private customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    private router: Router, private orderService: OrderService,
    protected storageService: StorageService,
    protected productService: ProductService,
    private orderDetailService: OrderDetailService,
    protected http: HttpClient,
    private datePipe: DatePipe) {

    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
    this.selectMakingRequestTime = new Date();
    this.orders = [];

  }

  filterByState() {
    var menuitems = [];

    menuitems.push({
      Name: "Tất cả",
      Value: 'ALL'
    });

    ORDER_DETAIL_STATES.forEach(item => {
      menuitems.push({
        Name: item.DisplayName,
        Value: item.State
      });
    });

    filterOrderByState(menuitems, (state) => {

      let states = state == 'ALL' ? [
        OrderDetailStates.Added,
        OrderDetailStates.Comfirming,
        OrderDetailStates.Deliveried,
        OrderDetailStates.Delivering,
        OrderDetailStates.DeliveryWaiting,
        OrderDetailStates.Making,
        OrderDetailStates.Waiting,
      ] : [
          state
        ];

      this.orderService.getOrderViewModelsByStates(states)
        .then(orders => {

          this.orders = orders;

        });
    });

  }

  searchOrder(phoneNumber) {
    this.orderService.searchByPhoneNumberOrCustomerName(phoneNumber)
      .then(orders => {
        this.orders = orders;
      });
  }

  logout() {

    this.authService.logOut(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['staff-login']);
      }

    });
  }

  protected async Init() {

    this.setStatusBarColor(false);

    const orderIds: string[] = [];
    const orderDetailVMs: OrderDetailViewModel[] = [];

    let states = [
      OrderDetailStates.Added,
      OrderDetailStates.Comfirming,
      OrderDetailStates.Deliveried,
      OrderDetailStates.Delivering,
      OrderDetailStates.DeliveryWaiting,
      OrderDetailStates.Making,
      OrderDetailStates.Waiting,
    ];

    this.orderService.getOrderViewModelsByStates(states)
      .then(orders => {

        this.orders = orders;

      });

    this.askForRememberPassword();

  }

  editOrder(orderId: string) {
    // console.info(this.orders);
    this.globalOrder = this.orders.filter(p => p.OrderId === orderId)[0];

    this.customerService.getById(this.globalOrder.CustomerInfo.Id)
      .then(customer => {

        this.globalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(customer, this.globalOrder.CustomerInfo);
        this.isEdittingOrder = true;

        this.router.navigate(['/staff/add-order']);

      });
  }

  addOrder() {

    this.globalOrder = new OrderViewModel();
    this.globalOrderDetail = new OrderDetailViewModel();
    this.isEdittingOrder = false;
    this.router.navigate(['/staff/add-order']);

  }

  openDetailInfo(id: number) {

    this.orders.forEach(order => {
      let isGot = false;

      order.OrderDetails.forEach(orderDetail => {

        if (orderDetail.OrderDetailId === id) {

          this.orderDetailService.getODFlorisAndShipper(orderDetail.OrderDetailId)
            .then(data => {
              this.selectedDetail.FloristName = data.Florist ? data.Florist.FullName : '...';
              this.selectedDetail.ShipperName = data.Shipper ? data.Shipper.FullName : '...';
              this.selectedDetail.State = orderDetail.State;
              this.selectedDetail.StateDisplay = ORDER_DETAIL_STATES.filter(p => p.State === orderDetail.State)[0].DisplayName;

              isGot = true;

            });


          return;

        }

      });

      if (isGot)
        return;

    });

    openColorBoard();
  }

  updateOrderDetailState(id: number) {

    let orderDetail: OrderDetailViewModel = new OrderDetailViewModel();
    let selectedOrder: OrderViewModel = new OrderViewModel();

    this.orders.forEach(order => {

      order.OrderDetails.forEach(detail => {
        if (detail.OrderDetailId === id) {
          orderDetail = detail;
          selectedOrder = order;
          return;
        }
      });

      if (orderDetail.OrderDetailId !== 0) {
        return;
      }

    });

    switch (orderDetail.State) {
      case OrderDetailStates.Added:
        this.updateAddedDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Waiting:
        this.updateWaitingDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Making:
        this.updateMakingDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Comfirming:
        this.updatConfirmingDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Deliveried:
        this.updateDeliveriedDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.DeliveryWaiting:
        this.updateDeliveryWaitingDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Delivering:
        this.updateDeliveringetailState(orderDetail, selectedOrder);
        break;

    }
  }

  updateDeliveringetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xem chi tiết',
      'Huỷ chi tiết đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            ShippingSortOrder: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
            });

          break;
      }
    }, items);

  }

  updateDeliveryWaitingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xem chi tiết',
      'Huỷ chi tiết đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            ShippingSortOrder: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
            });

          break;
      }
    }, items);

  }

  updateMakingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingSortOrder: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
            });

          break;
      }
    }, items);

  }

  updatConfirmingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xác nhận thành phẩm',
      'Làm lại đơn',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-confirming']);

          break;

        case 1:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "hh:mm a dd-MM-yyyy");
          this.selectMakingRequestTime = orderDetail.DeliveryInfo.DateTime;

          makingTimeRequest(() => {

            this.orderDetailService.getNextMakingSortOrder()
              .then(sortOrder => {

                this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
                  State: OrderDetailStates.Waiting,
                  MakingSortOrder: sortOrder,
                  MakingRequestTime: this.selectMakingRequestTime.getTime(),
                  FloristId: 0,
                  ResultImageUrl: '',
                  CompletedTime: 0
                })
                  .then(() => {

                    orderDetail.State = OrderDetailStates.Waiting;
                    orderDetail.MakingSortOrder = sortOrder;
                    orderDetail.MakingRequestTime = this.selectMakingRequestTime.getTime();

                  });

              });

          });
          break;
        case 2:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 3:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingSortOrder: 0,
            MakingRequestTime: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
              orderDetail.MakingSortOrder = 0;
              orderDetail.MakingRequestTime = 0;
              this.deleteOrderDetail(orderDetail, order);

            });

          break;
      }
    }, items);

  }

  updateDeliveriedDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xác nhận giao',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/final-confirm']);

          break;

        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingSortOrder: 0,
            MakingRequestTime: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
              orderDetail.MakingSortOrder = 0;
              orderDetail.MakingRequestTime = 0;
              this.deleteOrderDetail(orderDetail, order);

            });

          break;
      }
    }, items);

  }

  updateWaitingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xử lý sau',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Added,
            MakingSortOrder: 0,
            MakingRequestTime: 0
          })
            .then(() => {

              orderDetail.State = OrderDetailStates.Added;
              orderDetail.MakingSortOrder = 0;
              orderDetail.MakingRequestTime = 0;

            });

          break;

        case 1:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingSortOrder: 0,
            MakingRequestTime: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
              orderDetail.MakingSortOrder = 0;
              orderDetail.MakingRequestTime = 0;
              this.deleteOrderDetail(orderDetail, order);

            });

          break;
      }
    }, items);

  }

  updateAddedDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chuyển cho Florist',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "hh:mm a dd-MM-yyyy");
          this.selectMakingRequestTime = orderDetail.MakingRequestTime ? new Date(orderDetail.MakingRequestTime) : orderDetail.DeliveryInfo.DateTime;
          this.makingNote = orderDetail.MakingNote ? orderDetail.MakingNote : '';

          makingTimeRequest(() => {

            this.orderDetailService.getNextMakingSortOrder()
              .then(sortOrder => {

                console.log('next sort order:', sortOrder);

                this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
                  State: OrderDetailStates.Waiting,
                  MakingSortOrder: sortOrder,
                  MakingRequestTime: this.selectMakingRequestTime.getTime(),
                  MakingNote: this.makingNote
                })
                  .then(() => {

                    orderDetail.State = OrderDetailStates.Waiting;
                    orderDetail.MakingSortOrder = sortOrder;
                    orderDetail.MakingRequestTime = this.selectMakingRequestTime.getTime();
                    orderDetail.MakingNote = this.makingNote;

                  });

              });

          });

          break;

        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingSortOrder: 0
          })
            .then(() => {
              orderDetail.State = OrderDetailStates.Canceled;
              orderDetail.MakingSortOrder = 0;
              this.deleteOrderDetail(orderDetail, order);
            });

          break;
      }
    }, items);
  }

  deleteOrderDetail(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let index = order.OrderDetails.indexOf(orderDetail);
    order.OrderDetails.splice(index, 1);

    if (order.OrderDetails.length <= 0) {

      let selectedOrder = this.orders.filter(p => p.OrderId == order.OrderId)[0];

      this.orders.splice(this.orders.indexOf(selectedOrder), 1);
    }

  }

}
