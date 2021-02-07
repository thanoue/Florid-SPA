import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user.entity';

declare function chooseFlorist(saveCallBack: (id: number) => void): any;
declare function chooseShipper(saveCallBack: (id: number) => void): any;
@Component({
  selector: 'app-sort-order-changing',
  templateUrl: './sort-order-changing.component.html',
  styleUrls: ['./sort-order-changing.component.css']
})
export class SortOrderChangingComponent extends BaseComponent {

  Title = 'Thứ tự ưu tiên';
  protected IsDataLosingWarning = false;
  isAssigningShipper: boolean = false;
  shippers: User[];
  florists: User[];

  shippingODs: {
    OrderDetail: OrderDetailViewModel,
    IsSelect: boolean
  }[];

  makingODs: {
    OrderDetail: OrderDetailViewModel,
    IsSelect: boolean
  }[];
  isAssigningFlorist = false;


  constructor(private orderDetailService: OrderDetailService, private userService: UserService, private router: Router) {
    super();
    this.shippingODs = [];
    this.shippers = [];
    this.makingODs = [];
    this.florists = [];
  }

  protected Init() {

    this.loadMakingDetails();
    this.loadShippingDetails();

    this.userService.getByRole(Roles.Shipper)
      .then(users => {
        this.shippers = users;
      });

    this.userService.getByRole(Roles.Florist)
      .then(users => {
        this.florists = users;
      })
  }

  loadMakingDetails() {

    this.makingODs = []

    this.orderDetailService.getByStates([OrderDetailStates.Waiting, OrderDetailStates.FixingRequest], 'MakingRequestTime')
      .then(details => {

        details.forEach(detail => {
          this.makingODs.push({
            OrderDetail: detail,
            IsSelect: false
          })
        });

      });

  }

  loadShippingDetails() {

    this.shippingODs = [];
    this.orderDetailService.getByStates([OrderDetailStates.DeliveryWaiting], 'ReceivingTime')
      .then(details => {

        details.forEach(detail => {
          this.shippingODs.push({
            OrderDetail: detail,
            IsSelect: false
          });
        });

      });
  }

  viewShippingDetail(index: number) {

    if (this.isAssigningShipper) {

      this.shippingODs[index].IsSelect = !this.shippingODs[index].IsSelect;

      return;
    }

    this.globalOrderDetail = this.shippingODs[index].OrderDetail;
    this.router.navigate(['staff/order-detail-view']);

  }

  viewMakingDetail(index: number) {

    if (this.isAssigningFlorist) {

      this.makingODs[index].IsSelect = !this.makingODs[index].IsSelect;

      return;
    }

    this.globalOrderDetail = this.makingODs[index].OrderDetail;
    this.router.navigate(['staff/order-detail-view']);
  }

  gotoSelectShipperMode() {
    this.isAssigningShipper = true;
  }

  gotoSelectFloristMode() {
    this.isAssigningFlorist = true;
  }

  cancelShipperSelectMode() {
    this.shippingODs.forEach(od => {
      od.IsSelect = false;
    });
    this.isAssigningShipper = false;
  }

  cancelFloristSelectMode() {
    this.makingODs.forEach(od => {
      od.IsSelect = false;
    });
    this.isAssigningFlorist = false;
  }



  assignUsers(userId: number) {

    this.openConfirm(this.isAssigningShipper ? 'Xác nhận giao đơn cho shipper?' : 'Xác nhận phân công florist?', () => {


      if (this.isAssigningShipper) {

        let orderDetailIds: number[] = [];

        this.shippingODs.forEach(od => {

          if (od.IsSelect) {
            orderDetailIds.push(od.OrderDetail.OrderDetailId);
          }

        });

        this.orderDetailService.assignOrderDetails(orderDetailIds, userId, (new Date()).getTime())
          .then(res => {
            this.isAssigningShipper = false;
            this.loadMakingDetails();
            this.loadShippingDetails();
          });

      } else {

        let orderDetails: OrderDetailViewModel[] = [];
        this.makingODs.forEach(od => {

          if (od.IsSelect) {
            orderDetails.push(od.OrderDetail);
          }

        });

        this.orderDetailService.assignFloristForOrderDetails(orderDetails, userId, (new Date()).getTime())
          .then(res => {
            this.isAssigningFlorist = false;
            this.loadMakingDetails();
            this.loadShippingDetails();
          });

      }

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

    if (isHas) {
      chooseShipper((id) => {
        this.assignUsers(+id);
      })
    }

  }

  selectFloristDialogOpen() {

    let isHas = false;
    this.makingODs.forEach(od => {

      if (od.IsSelect) {
        isHas = true;
        return;
      }

    });

    if (isHas) {
      chooseFlorist((id) => {
        this.assignUsers(+id);
      })
    }

  }
}
