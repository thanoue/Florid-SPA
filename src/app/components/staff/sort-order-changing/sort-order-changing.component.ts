import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user.entity';

declare function openViewed(): any;
declare function dismissShipperSelecting(callback: () => void): any;

@Component({
  selector: 'app-sort-order-changing',
  templateUrl: './sort-order-changing.component.html',
  styleUrls: ['./sort-order-changing.component.css']
})
export class SortOrderChangingComponent extends BaseComponent {

  Title = 'Thứ tự ưu tiên';
  protected IsDataLosingWarning = false;
  makingOrderDetails: OrderDetailViewModel[];
  isAssigningShipper: boolean = false;
  shippers: User[];

  shippingODs: {
    ShippingOrderDetail: OrderDetailViewModel,
    IsSelect: boolean
  }[];

  // shippingOrderDetails: OrderDetailViewModel[];

  constructor(private orderDetailService: OrderDetailService, private userService: UserService, private router: Router) {
    super();
    this.shippingODs = [];
    this.shippers = [];

  }

  protected Init() {

    this.loadMakingDetails();
    this.loadShippingDetails();

    this.userService.getByRole(Roles.Shipper)
      .then(users => {
        this.shippers = users;
      })
  }

  loadMakingDetails() {

    this.makingOrderDetails = [];

    this.orderDetailService.getByState(OrderDetailStates.Waiting)
      .then(details => {

        this.makingOrderDetails = details;
        this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)

      });

  }

  loadShippingDetails() {

    this.shippingODs = [];
    this.orderDetailService.getByState(OrderDetailStates.DeliveryWaiting)
      .then(details => {

        details.forEach(detail => {
          this.shippingODs.push({
            ShippingOrderDetail: detail,
            IsSelect: false
          });
        });
        this.shippingODs.sort((a, b) => a.ShippingOrderDetail.ShippingSortOrder < b.ShippingOrderDetail.ShippingSortOrder ? -1 : a.ShippingOrderDetail.ShippingSortOrder > b.ShippingOrderDetail.ShippingSortOrder ? 1 : 0)

      });
  }

  viewDetail(index: number) {

    if (this.isAssigningShipper) {

      this.shippingODs[index].IsSelect = !this.shippingODs[index].IsSelect;

      return;
    }

    this.globalOrderDetail = this.shippingODs[index].ShippingOrderDetail;
    this.router.navigate(['staff/order-detail-view']);
  }

  dropMakingList(event: CdkDragDrop<string[]>) {

    var oldOrder = this.makingOrderDetails[event.previousIndex].MakingSortOrder;
    var newOrder = this.makingOrderDetails[event.currentIndex].MakingSortOrder;

    console.log(oldOrder, newOrder);

    if (oldOrder === newOrder)
      return;

    let updates: {
      Id: Number,
      MarkingSortOrder: Number
    }[] = [];

    this.makingOrderDetails.forEach(detail => {

      if (detail.MakingSortOrder >= newOrder && detail.MakingSortOrder <= oldOrder) {

        detail.MakingSortOrder = detail.MakingSortOrder < oldOrder ? detail.MakingSortOrder + 1 : newOrder;
        updates.push({
          Id: detail.OrderDetailId,
          MarkingSortOrder: detail.MakingSortOrder
        })
      }

      if (detail.MakingSortOrder <= newOrder && detail.MakingSortOrder >= oldOrder) {

        detail.MakingSortOrder = detail.MakingSortOrder > oldOrder ? detail.MakingSortOrder - 1 : newOrder;
        updates.push({
          Id: detail.OrderDetailId,
          MarkingSortOrder: detail.MakingSortOrder
        })
      }

    });

    this.orderDetailService.updateMakingSortOrders(updates)
      .then(() => {
        this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)
      });
  }

  dropShippingList(event: CdkDragDrop<string[]>) {

    var oldOrder = this.shippingODs[event.previousIndex].ShippingOrderDetail.ShippingSortOrder;
    var newOrder = this.shippingODs[event.currentIndex].ShippingOrderDetail.ShippingSortOrder;

    if (oldOrder === newOrder)
      return;

    let updates: {
      Id: Number,
      ShippingSortOrder: Number
    }[] = [];

    this.shippingODs.forEach(od => {

      let detail = od.ShippingOrderDetail;

      if (detail.ShippingSortOrder >= newOrder && detail.ShippingSortOrder <= oldOrder) {

        detail.ShippingSortOrder = detail.ShippingSortOrder < oldOrder ? detail.ShippingSortOrder + 1 : newOrder;
        updates.push({
          Id: detail.OrderDetailId,
          ShippingSortOrder: detail.ShippingSortOrder
        });
      }

      if (detail.ShippingSortOrder <= newOrder && detail.ShippingSortOrder >= oldOrder) {

        detail.ShippingSortOrder = detail.ShippingSortOrder > oldOrder ? detail.ShippingSortOrder - 1 : newOrder;
        updates.push({
          Id: detail.OrderDetailId,
          ShippingSortOrder: detail.ShippingSortOrder
        });
      }

    });

    this.orderDetailService.updateMakingSortOrders(updates)
      .then(() => {
        this.shippingODs.sort((a, b) => a.ShippingOrderDetail.ShippingSortOrder < b.ShippingOrderDetail.ShippingSortOrder ? -1 : a.ShippingOrderDetail.ShippingSortOrder > b.ShippingOrderDetail.ShippingSortOrder ? 1 : 0)
      });
  }

  move(state: OrderDetailStates, index: number, isUp: boolean) {

    let orderDetail: OrderDetailViewModel;
    let secondDetail: OrderDetailViewModel;

    switch (state) {

      case OrderDetailStates.Waiting:

        orderDetail = this.makingOrderDetails[index];

        if ((isUp && index <= 0) || (!isUp && index >= this.makingOrderDetails.length - 1))
          return;

        secondDetail = this.makingOrderDetails[isUp ? index - 1 : index + 1];

        if (secondDetail) {

          let updates: {
            Id: Number,
            MakingSortOrder: Number
          }[] = [];

          updates.push({
            Id: secondDetail.OrderDetailId,
            MakingSortOrder: orderDetail.MakingSortOrder
          });

          updates.push({
            Id: orderDetail.OrderDetailId,
            MakingSortOrder: secondDetail.MakingSortOrder
          });

          this.orderDetailService.updateMakingSortOrders(updates)
            .then(() => {
              let tempSort = secondDetail.MakingSortOrder;
              secondDetail.MakingSortOrder = orderDetail.MakingSortOrder;
              orderDetail.MakingSortOrder = tempSort;
              this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)
            });

        }

        break;

      case OrderDetailStates.DeliveryWaiting:

        orderDetail = this.shippingODs[index].ShippingOrderDetail

        if ((isUp && index <= 0) || (!isUp && index >= this.shippingODs.length - 1))
          return;

        secondDetail = this.shippingODs[isUp ? index - 1 : index + 1].ShippingOrderDetail;

        if (secondDetail) {

          let updates: {
            Id: Number,
            ShippingSortOrder: Number
          }[] = [];

          updates.push({
            Id: secondDetail.OrderDetailId,
            ShippingSortOrder: orderDetail.ShippingSortOrder
          });
          updates.push({
            Id: orderDetail.OrderDetailId,
            ShippingSortOrder: secondDetail.ShippingSortOrder
          });

          this.orderDetailService.updateShippingSortOrders(updates)
            .then(() => {

              let tempSort = secondDetail.ShippingSortOrder;
              secondDetail.ShippingSortOrder = orderDetail.ShippingSortOrder;
              orderDetail.ShippingSortOrder = tempSort;

              this.shippingODs.sort((a, b) => a.ShippingOrderDetail.ShippingSortOrder < b.ShippingOrderDetail.ShippingSortOrder ? -1 : a.ShippingOrderDetail.ShippingSortOrder > b.ShippingOrderDetail.ShippingSortOrder ? 1 : 0)
            });

        }

        break;
    }
  }

  gotoSelectMode() {
    this.isAssigningShipper = true;
  }

  cancelSelectMode() {
    this.shippingODs.forEach(od => {
      od.IsSelect = false;
    });
    this.isAssigningShipper = false;
  }

  selectShipper(shipper: User) {

    dismissShipperSelecting(() => {
      this.openConfirm('Xác nhận giao đơn cho shipper?', () => {

        let orderDetailIds: number[] = [];

        this.shippingODs.forEach(od => {

          if (od.IsSelect) {
            orderDetailIds.push(od.ShippingOrderDetail.OrderDetailId);
          }

        });

        this.orderDetailService.assignOrderDetails(orderDetailIds, shipper.Id, (new Date()).getTime())
          .then(res => {
            this.isAssigningShipper = false;
            this.loadMakingDetails();
            this.loadShippingDetails();
          });

      });

    });

  }

  selectShipperDialogOpen() {

    let isHas = false;
    this.shippingODs.forEach(od => {

      if (od.IsSelect) {
        isHas = true;
        return;
      }

    });

    if (isHas)
      openViewed();

  }
}
