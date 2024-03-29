import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ExchangeService } from 'src/app/services/exchange.service';

declare function getDateTimeSelecting(year: number, month: number, day: number, hour: number, minute: number): any;
declare function getTimeSelecting(hour: number, minute: number): any;

@Component({
  selector: 'app-select-receiver',
  templateUrl: './select-receiver.component.html',
  styleUrls: ['./select-receiver.component.css']
})
export class SelectReceiverComponent extends BaseComponent {

  Title = 'Thông tin người nhận';

  currentList: OrderDetailDeliveryInfo[];
  deliveryInfo: OrderDetailDeliveryInfo;

  protected IsDataLosingWarning = false;

  constructor(private route: ActivatedRoute, private _ngZone: NgZone) {
    super();
  }

  addressChoosing() {
    this.selectAddress((res) => {
      this.deliveryInfo.Address = res;
    });
  }

  protected Init() {

    const key = 'DeliveryInfoReference';

    window[key] = {
      component: this,
      zone: this._ngZone,
      selectDeliveryInfo: (data) => this.selectDeliveryInfo(data),
    };

    this.currentList = [];

    this.globalOrder.OrderDetails.forEach(orderDetail => {

      const newItem = OrderDetailDeliveryInfo.DeepCopy(orderDetail.DeliveryInfo);

      let isAdd = true;

      this.currentList.forEach(item => {
        if (ExchangeService.deliveryInfoCompare(newItem, item)) {
          isAdd = false;
          return;
        }
      });

      if (isAdd) {
        this.currentList.push(newItem);
      }

    });

    if (this.globalOrder.CustomerInfo) {

      this.globalOrder.CustomerInfo.ReceiverInfos.forEach(receiver => {

        let isAdd = true;

        this.currentList.forEach(item => {

          const newItem = {
            FullName: item.FullName,
            PhoneNumber: item.PhoneNumber,
            Address: item.Address
          };

          if (ExchangeService.receiverInfoCompare(receiver, newItem)) {
            isAdd = false;
            return;
          }

        });

        if (isAdd) {
          this.currentList.push({
            FullName: receiver.FullName,
            PhoneNumber: receiver.PhoneNumber,
            Address: receiver.Address,
            DateTime: new Date()
          });
        }

      });

    }

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.route.params.subscribe(params => {

      this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.globalOrderDetail.DeliveryInfo);

      this.deliveryInfo.DateTime.setSeconds(0);

    });

  }

  selectDeliveryInfo(index: number) {
    this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.currentList[index]);
  }

  addReceiver(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.globalOrderDetail.DeliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.deliveryInfo);

    super.OnBackNaviage();

  }

}
