import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/common/exchange.service';
import { environment } from 'src/environments/environment';
import { IMAGE_FOLDER_PATHS } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

declare function shareImageCusWithData(img: string, contactInfo: string): any;
declare function deleteTempImage(): any;

@Component({
  selector: 'app-final-confirm',
  templateUrl: './final-confirm.component.html',
  styleUrls: ['./final-confirm.component.css']
})
export class FinalConfirmComponent extends BaseComponent {

  Title = 'Xác nhận giao hàng'
  orderDetail: OrderDetailViewModel;
  sharingImage = '';
  customer: Customer;

  protected Init() {

    this.orderDetail = this.globalOrderDetail;

    this.customerService.getById(this.globalOrder.CustomerInfo.Id).then(customer => {
      this.customer = customer;
    });

  }

  constructor(private router: Router, private orderService: OrderService, private orderDetailService: OrderDetailService, private storageService: StorageService, private customerService: CustomerService) {
    super();
  }

  protected destroy() {

    super.destroy();
    deleteTempImage();

  }

  confirmOrderDetail() {

    this.orderDetailService.updateFields(this.orderDetail.OrderDetailId, {
      State: OrderDetailStates.Completed,
    })
      .then(async () => {

        this.router.navigate(['staff/orders-manage']);

      });
  }

  getShippingImg(): string {

    const shipping = this.orderDetailService.getLastestShipping(this.orderDetail);

    if (shipping != null) {
      return shipping.DeliveryImageUrl;
    }

    return '';
  }

  getResultImg() {

    const making = this.orderDetailService.getLastestMaking(this.orderDetail);

    if (making != null) {
      return making.ResultImageUrl;
    }

    return '';
  }

  shareToCus() {

    this.startLoading();

    this.storageService.downloadFIle(`${environment.base_domain}${IMAGE_FOLDER_PATHS.shipping_img}${this.getShippingImg()}`, (file) => {

      this.stopLoading();

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {

        const base64data = reader.result.toString();
        this.sharingImage = base64data;

        shareImageCusWithData(this.sharingImage, ExchangeService.getMainContact(this.customer));

      };

    });

  }

}
