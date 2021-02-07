import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel, OrderCustomerInfoViewModel } from '../../../models/view.models/order.model';
import { OrderDetailStates, Roles, MakingType } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { StorageService } from 'src/app/services/storage.service';
import { ProductService } from 'src/app/services/product.service';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/entities/user.entity';
import { UserService } from 'src/app/services/user.service';
import { MyDatepipe } from 'src/app/pipes/date.pipe';
import { PrintJob, PrintSaleItem, purchaseItem } from 'src/app/models/entities/printjob.entity';
import { PrintJobService } from 'src/app/services/print-job.service';

declare function openColorBoard(): any;
declare function customerSupport(): any;
declare function makingTimeRequest(saveCallBack: () => void, chooseFloristCallBack: () => void): any;
declare function shippingRequest(saveCallBack: () => void, chooseFloristCallBack: () => void): any;
declare function chooseFlorist(saveCallBack: (id: number) => void): any;
declare function chooseShipper(saveCallBack: (id: number) => void): any;
declare function saveFile(url, productId, callback: () => void): any;
declare function filterOrderByState(menuitems: { Name: string; Value: number; }[], callback: (val: any) => void): any;
declare function locationDetection(location: any): any;
declare function getShippingNoteDialog(btnTitle: string, callback: (note: string) => void): any;

export interface ISelectedDetail {
  State: OrderDetailStates;
  StateDisplay: string;
  Shippers: User[];
  Florists: User[];
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
  selectReceiveRequestTime: Date;
  orders: OrderViewModel[];
  states = OrderDetailStates;
  makingNote: string;
  shippingNote: string;
  florists: User[];
  shippers: User[];
  pageSize = 20;
  currentPage = 0;
  totalPage = 0;
  statuses: any[] = [];
  searchTerm: string = "";
  allStatuses: any[] = [
    OrderDetailStates.Added,
    OrderDetailStates.Comfirming,
    OrderDetailStates.Deliveried,
    OrderDetailStates.DeliverAssinged,
    OrderDetailStates.DeliveryWaiting,
    OrderDetailStates.Making,
    OrderDetailStates.Waiting,
    OrderDetailStates.SentBack,
    OrderDetailStates.Fixing,
    OrderDetailStates.FixingRequest,
    OrderDetailStates.Completed,
    OrderDetailStates.Canceled
  ];

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
    private datePipe: MyDatepipe,
    private userService: UserService,
    private printJobService: PrintJobService) {

    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
    this.selectMakingRequestTime = new Date();
    this.orders = [];
    this.florists = [];
    this.shippers = [];
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
      case OrderDetailStates.Fixing:

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

      case OrderDetailStates.OnTheWay:
      case OrderDetailStates.DeliverAssinged:

        this.updateAssignedShipperDetailState(orderDetail, selectedOrder);

        break;

      case OrderDetailStates.DeliverAssinged:
        this.updateDeliveringetailState(orderDetail, selectedOrder);
        break;

      case OrderDetailStates.SentBack:
        this.updateSentBackDetailState(orderDetail, selectedOrder);
        break;

      case OrderDetailStates.Completed:

        this.globalOrderDetail = orderDetail;
        this.globalOrder = selectedOrder;

        this.router.navigate(['staff/order-detail-view']);

        break;
      case OrderDetailStates.FixingRequest:
        this.updateFixingRequestDetailState(orderDetail, selectedOrder);
        break;

    }
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

      this.currentPage = 0;

      this.statuses = state == 'ALL' ? this.allStatuses : [
        state
      ];

      this.getOrders();

    });

  }

  getOrders() {

    this.orders = [];
    this.orderService.searchOrders(this.currentPage, this.pageSize, this.statuses, this.searchTerm)
      .then(orders => {

        this.totalPage = orders.totalPages;
        this.orders = orders.orders;

      });
  }

  searchOrder(phoneNumber) {

    this.currentPage = 0;
    this.searchTerm = phoneNumber;

    this.getOrders();

  }

  goToPage(page: number) {

    if (page >= this.totalPage || page < 0)
      return;

    this.currentPage = page;

    this.orderService.searchOrders(this.currentPage, this.pageSize, this.statuses, this.searchTerm)
      .then(orders => {

        this.totalPage = orders.totalPages;
        this.orders = orders.orders;

      });
  }

  logout() {

    this.authService.logOut(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['staff/login']);
      }

    });
  }

  protected async Init() {

    this.setStatusBarColor(false);

    this.statuses = this.allStatuses;

    this.orderService.searchOrders(this.currentPage, this.pageSize, this.statuses)
      .then(orders => {

        this.totalPage = orders.totalPages;
        this.orders = orders.orders;

      });

    this.askForRememberPassword();

    this.userService.getByRole(Roles.Florist)
      .then(users => {
        this.florists = users;
      });

    this.userService.getByRole(Roles.Shipper)
      .then(users => {
        this.shippers = users;
      })
  }

  doPrintJob(order: OrderViewModel) {

    let tempSummary = 0;
    const products: PrintSaleItem[] = [];

    order.OrderDetails.forEach(product => {
      products.push({
        productName: product.ProductName,
        index: product.Index + 1,
        price: product.ModifiedPrice,
        additionalFee: product.AdditionalFee,
        discount: this.getDiscount(product.ModifiedPrice, product.PercentDiscount, product.AmountDiscount),
        quantity: product.Quantity
      });
      tempSummary += product.ModifiedPrice;
    });

    let purhases: purchaseItem[] = [];

    if (order.PurchaseItems)
      order.PurchaseItems.forEach(purchase => {

        purhases.push({
          method: purchase.Method,
          amount: purchase.Amount,
        });

      });

    const orderData: PrintJob = {
      Created: (new Date()).getTime(),
      doneTime: new Date(order.DoneTime).toLocaleString('en-US', { hour12: false }),
      Id: order.OrderId,
      Active: true,
      IsDeleted: false,
      saleItems: products,
      createdDate: order.CreatedDate.toLocaleString('en-US', { hour12: false }),
      orderId: order.OrderId,
      summary: tempSummary,
      totalAmount: order.TotalAmount,
      totalPaidAmount: order.TotalPaidAmount,
      totalBalance: order.TotalAmount - order.TotalPaidAmount,
      vatIncluded: order.VATIncluded,
      memberDiscount: order.CustomerInfo.DiscountPercent,
      scoreUsed: order.CustomerInfo.ScoreUsed,
      gainedScore: order.CustomerInfo.GainedScore,
      totalScore: order.CustomerInfo.AvailableScore - order.CustomerInfo.ScoreUsed + order.CustomerInfo.GainedScore,
      customerName: order.CustomerInfo.Name,
      customerId: order.CustomerInfo.Id,
      discount: this.getDiscount(order.TotalAmount, order.PercentDiscount, order.AmountDiscount),
      purchaseItems: purhases,
      isMemberDiscountApply: order.IsMemberDiscountApply
    };

    this.printJobService.addPrintJob(orderData);
  }

  getDiscount(price: number, percentDiscount: number, amountDidcount: number): number {

    let discount = 0;

    if (percentDiscount && percentDiscount > 0)
      discount = (price / 100) * percentDiscount;

    if (amountDidcount && amountDidcount > 0)
      discount = discount + amountDidcount;

    return discount;
  }

  selectOrder(order: OrderViewModel) {

    let items = [
      'Thêm thanh toán',
      'In hoá đơn',
      'Hoàn tất đơn',
      'Huỷ đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {

        case 0:

          this.viewPurchase(order.OrderId);

          break;

        case 1:

          this.doPrintJob(order);

          break;

        case 2:

          this.orderDetailService.updateStatusByOrderId(order.OrderId, OrderDetailStates.Completed)
            .then(res => {

              this.orderService.searchOrders(this.currentPage, this.pageSize, this.statuses)
                .then(orders => {

                  this.totalPage = orders.totalPages;
                  this.orders = orders.orders;

                });
            });

          break;

        case 3:

          this.orderDetailService.updateStatusByOrderId(order.OrderId, OrderDetailStates.Canceled)
            .then(res => {

              this.orderService.searchOrders(this.currentPage, this.pageSize, this.statuses)
                .then(orders => {

                  this.totalPage = orders.totalPages;
                  this.orders = orders.orders;

                });
            });

          break;

      }
    }, items);


  }

  editOrder(orderId: string) {

    this.globalOrder = this.orders.filter(p => p.OrderId === orderId)[0];

    this.globalPurchases = this.globalOrder.PurchaseItems;
    this.isEdittingOrder = true;

    this.customerService.getById(this.globalOrder.CustomerInfo.Id)
      .then(customer => {

        if (customer) {
          this.globalOrder.CustomerInfo = this.orderService.getCustomerInfo(customer, this.globalOrder);
        }

        this.router.navigate(['/staff/add-order']);

      });
  }

  viewPurchase(orderId: string) {

    this.globalOrder = this.orders.filter(p => p.OrderId === orderId)[0];

    this.globalPurchases = this.globalOrder.PurchaseItems;

    this.router.navigate(['staff/view-purchase']);

  }

  addOrder() {

    this.globalOrder = new OrderViewModel();
    this.globalOrderDetail = new OrderDetailViewModel();
    this.isEdittingOrder = false;
    this.globalPurchases = [];

    this.router.navigate(['/staff/add-order']);

  }

  getDetailById(id: number): OrderDetailViewModel {

    return this.orders.filter(p => p.OrderDetails.filter(p => p.OrderDetailId == id).length > 0)[0].OrderDetails.filter(c => c.OrderDetailId == id)[0];

  }

  openDetailInfo(id: number) {

    let orderDetail = this.getDetailById(id);

    if (!orderDetail)
      return;

    this.selectedDetail.Shippers = orderDetail.Shippers ? orderDetail.Shippers : [];
    this.selectedDetail.Florists = orderDetail.Florists ? orderDetail.Florists : [];

    this.selectedDetail.State = orderDetail.State;
    this.selectedDetail.StateDisplay = ORDER_DETAIL_STATES.filter(p => p.State === orderDetail.State)[0].DisplayName;

    openColorBoard();
  }

  updateAssignedShipperDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chọn lại Shipper',
      'Hoàn thành giao',
      'Trả đơn về',
      'Xem chi tiết',
      'Huỷ  đơn'
    ];

    this.menuOpening((index) => {

      switch (+index) {

        case 0:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd-MM-yyyy");
          this.selectReceiveRequestTime = orderDetail.DeliveryInfo.DateTime;
          this.shippingNote = orderDetail.ShippingNote;

          let newObj = {
            State: OrderDetailStates.DeliveryWaiting,
            ReceivingTime: this.selectReceiveRequestTime.getTime(),
            ShippingNote: this.shippingNote
          };

          shippingRequest(() => {

            newObj.ShippingNote = this.shippingNote;
            newObj.ReceivingTime = this.selectReceiveRequestTime.getTime();

            this.orderDetailService.updateFields(orderDetail.OrderDetailId, newObj).then(res => {

              this.orderDetailService.replaceShipper(orderDetail.OrderDetailId, this.orderDetailService.getLastestShipping(orderDetail).Id, -1)
                .then(() => {

                  this.getOrders();

                });

            });

          }, () => {

            chooseShipper((id) => {

              newObj.State = OrderDetailStates.DeliverAssinged;
              newObj.ShippingNote = this.shippingNote;
              newObj.ReceivingTime = this.selectReceiveRequestTime.getTime();

              this.orderDetailService.updateFields(orderDetail.OrderDetailId, newObj).then(res => {

                this.orderDetailService.replaceShipper(orderDetail.OrderDetailId, this.orderDetailService.getLastestShipping(orderDetail).Id, +id)
                  .then(() => {

                    this.getOrders();

                  });

              });

            });

          });

          break;

        case 1:

          this.openConfirm('Hoàn tất giao đơn này?', () => {
            getShippingNoteDialog('Hoàn tất', (note) => {

              this.orderDetailService.shippingConfirm(orderDetail, null, note)
                .then(res => {
                  this.getOrders();
                });

            });

          });

          break;

        case 2:

          if (orderDetail.State == OrderDetailStates.DeliverAssinged) {
            this.showInfo('Đơn chưa bắt đầu giao!');
            return;
          }

          this.openConfirm('Trả lại cừa hàng đơn này?', () => {
            getShippingNoteDialog('Trả đơn', (note) => {


              this.orderDetailService.updateShippingFields(this.orderDetailService.getLastestShipping(orderDetail).Id, {
                Note: note,
                CompleteTime: new Date().getTime(),
                DeliveryImageUrl: ''
              }).then(data => {

                this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                  State: OrderDetailStates.SentBack

                }).then(res => {

                  this.getOrders();

                });
              }).catch(err => {
                this.showError(err);
              });

            });

          });

          break;

        case 4:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {

              this.getOrders();

            });

          break;

        case 3:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

      }

    }, items);
  }

  updateFixingRequestDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chọn Florist',
      'Xem chi tiết',
      'Huỷ  đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {

        case 1:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 0:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm  dd-MM-yyyy");
          this.selectMakingRequestTime = new Date();
          this.makingNote = orderDetail.MakingNote;

          makingTimeRequest(() => {
            this.transferToFlorist(orderDetail, MakingType.Fixing)
          }, () => {
            chooseFlorist((floristId) => {
              this.transferToFlorist(orderDetail, MakingType.Fixing, +floristId)
            });
          });

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {
              this.getOrders();

            });

          break;

      }
    }, items);

  }

  updateSentBackDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Giao sau',
      'Làm lại đơn',
      'Xem chi tiết',
      'Huỷ  đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {

        case 2:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 0:

          this.assignShipper(orderDetail);

          break;

        case 1:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd-MM-yyyy");
          this.selectMakingRequestTime = new Date();
          this.makingNote = orderDetail.MakingNote;

          makingTimeRequest(() => {
            this.transferToFlorist(orderDetail, MakingType.Fixing)
          }, () => {
            chooseFlorist((floristId) => {
              this.transferToFlorist(orderDetail, MakingType.Fixing, +floristId)
            });
          });

          break;

        case 3:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

            State: OrderDetailStates.Canceled,

          })
            .then(() => {

              this.getOrders();

            });

          break;

      }
    }, items);
  }

  updateDeliveringetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xem chi tiết',
      'Hoàn thành đơn',
      'Huỷ chi tiết đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {
        case 0:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 1:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Deliveried,
          }).then(() => {
            this.orderDetailService.shippingConfirm(orderDetail, null, '')
              .then(() => {
                this.getOrders();
              })
          });

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {

              this.getOrders();

            });

          break;
      }
    }, items);

  }

  assignShipper(orderDetail: OrderDetailViewModel) {

    this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd-MM-yyyy");
    this.selectReceiveRequestTime = orderDetail.DeliveryInfo.DateTime;
    this.shippingNote = '';

    let obj = {
      State: OrderDetailStates.DeliveryWaiting,
      ReceivingTime: this.selectReceiveRequestTime.getTime(),
      ShippingNote: this.shippingNote
    };

    shippingRequest(() => {

      obj.ReceivingTime = this.selectReceiveRequestTime.getTime();
      obj.ShippingNote = this.shippingNote;

      this.orderDetailService.updateFields(orderDetail.OrderDetailId, obj).then(res => {

        this.getOrders();

      });

    }, () => {

      chooseShipper((id) => {

        obj.State = OrderDetailStates.DeliverAssinged;
        obj.ReceivingTime = this.selectReceiveRequestTime.getTime();
        obj.ShippingNote = this.shippingNote;

        this.orderDetailService.updateFields(orderDetail.OrderDetailId, obj).then(res => {

          this.orderDetailService.assignSingleOD(orderDetail.OrderDetailId, +id, (new Date()).getTime())
            .then(res => {

              this.getOrders();

            });

        });

      });

    });

  }

  updateDeliveryWaitingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chọn Shipper',
      'Xem chi tiết',
      'Huỷ chi tiết đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {

        case 0:
          this.assignShipper(orderDetail);
          break;

        case 1:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {
              this.getOrders();
            });

          break;
      }
    }, items);

  }

  updateMakingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xử lý sau',
      'Đổi florist',
      'Giao hàng',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {
        case 0:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: orderDetail.State == OrderDetailStates.Making ? OrderDetailStates.Added : OrderDetailStates.FixingRequest,
            MakingRequestTime: 0,
            FloristId: null
          })
            .then(() => {

              this.getOrders();

            });

          break;

        case 1:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd-MM-yyyy");
          this.selectMakingRequestTime = new Date(orderDetail.MakingRequestTime);
          this.makingNote = orderDetail.MakingNote;

          let newObj = {
            State: OrderDetailStates.Waiting,
            MakingRequestTime: this.selectMakingRequestTime.getTime(),
            MakingNote: this.makingNote
          };

          makingTimeRequest(() => {

            newObj.MakingNote = this.makingNote;
            newObj.MakingRequestTime = this.selectMakingRequestTime.getTime();

            this.orderDetailService.updateFields(orderDetail.OrderDetailId, newObj).then(res => {

              this.orderDetailService.replaceFlorist(orderDetail.OrderDetailId, this.orderDetailService.getLastestMaking(orderDetail).Id, -1)
                .then(() => {

                  this.getOrders();

                });

            });

          }, () => {

            chooseFlorist((id) => {

              newObj.State = OrderDetailStates.FixerAssigned;
              newObj.MakingNote = this.makingNote;
              newObj.MakingRequestTime = this.selectMakingRequestTime.getTime();

              this.orderDetailService.updateFields(orderDetail.OrderDetailId, newObj).then(res => {

                this.orderDetailService.replaceFlorist(orderDetail.OrderDetailId, this.orderDetailService.getLastestMaking(orderDetail).Id, +id)
                  .then(() => {

                    this.getOrders();

                  });

              });

            });

          });


          break;

        case 2:

          this.openConfirm('Hoàn thành đơn này?', () => {

            this.orderDetailService.updateMakingFields(this.orderDetailService.getLastestMaking(orderDetail).Id, {
              CompleteTime: (new Date()).getTime(),
            }).then(() => {

              this.orderDetailService.updateFields(orderDetail.OrderDetailId, {

                State: OrderDetailStates.Comfirming,

              }).then(() => {

                this.assignShipper(orderDetail);

              });

            });

          });

          break;

        case 3:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 4:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {
              this.getOrders();
            });

          break;
      }
    }, items);

  }

  updatConfirmingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xác nhận thành phẩm',
      'Giao hàng',
      'Làm lại đơn',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {

        case 0:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['staff/order-detail-confirming']);

          break;

        case 1:

          this.assignShipper(orderDetail);

          break;

        case 2:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd-MM-yyyy");
          this.selectMakingRequestTime = orderDetail.DeliveryInfo.DateTime;
          this.makingNote = '';

          makingTimeRequest(() => {
            this.transferToFlorist(orderDetail, MakingType.Fixing)
          }, () => {
            chooseFlorist((floristId) => {
              this.transferToFlorist(orderDetail, MakingType.Fixing, +floristId);
            });
          });

          break;
        case 3:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 4:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingRequestTime: 0
          })
            .then(() => {

              this.getOrders();

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

    this.menuOpening((index) => {
      switch ((+index)) {
        case 0:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/final-confirm']);

          break;

        case 1:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);

          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingRequestTime: 0
          })
            .then(() => {
              this.getOrders();

            });

          break;
      }
    }, items);

  }

  updateWaitingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xử lý sau',
      'Giao hàng',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {
        case 0:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Added,
          })
            .then(() => {

              orderDetail.State = OrderDetailStates.Added;
              orderDetail.MakingRequestTime = 0;

            });

          break;

        case 1:

          this.assignShipper(orderDetail);

          break;

        case 2:
          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
            MakingRequestTime: 0
          })
            .then(() => {

              this.getOrders();

            });

          break;
      }
    }, items);

  }

  transferToFlorist(orderDetail: OrderDetailViewModel, makingType: MakingType, floristId?: number) {

    if (!floristId) {

      this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
        State: makingType == MakingType.Making ? OrderDetailStates.Waiting : OrderDetailStates.FixingRequest,
        MakingNote: this.makingNote,
        MakingRequestTime: this.selectMakingRequestTime.getTime()
      })
        .then(() => {

          this.getOrders();

        });
    }
    else {

      this.orderDetailService.assignSingleMaking(orderDetail.OrderDetailId, floristId, new Date().getTime(), makingType)
        .then(() => {

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            MakingNote: this.makingNote,
            State: makingType == MakingType.Making ? OrderDetailStates.FloristAssigned : OrderDetailStates.FixerAssigned,
            MakingRequestTime: this.selectMakingRequestTime.getTime()
          })
            .then(() => {

              this.getOrders();

            });

        });
    }

  }

  updateAddedDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chuyển cho Florist',
      'Xem chi tiết',
      'Giao hàng',
      'Huỷ đơn'
    ];

    this.menuOpening((index) => {
      switch ((+index)) {
        case 0:

          this.selectDeliveryTime = this.datePipe.transform(orderDetail.DeliveryInfo.DateTime, "HH:mm dd/MM/yyyy");
          this.selectMakingRequestTime = orderDetail.MakingRequestTime ? new Date(orderDetail.MakingRequestTime) : orderDetail.DeliveryInfo.DateTime;
          this.makingNote = orderDetail.MakingNote ? orderDetail.MakingNote : '';

          makingTimeRequest(() => {

            this.transferToFlorist(orderDetail, MakingType.Making);

          }, () => {

            chooseFlorist((id) => {
              this.transferToFlorist(orderDetail, MakingType.Making, +id);
            });

          });

          break;

        case 1:

          this.globalOrderDetail = orderDetail;
          this.globalOrder = order;
          this.router.navigate(['staff/order-detail-view']);
          break;

        case 2:

          this.assignShipper(orderDetail);

          break;

        case 3:

          this.orderDetailService.updateFields(orderDetail.OrderDetailId, {
            State: OrderDetailStates.Canceled,
          })
            .then(() => {
              this.getOrders();

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
