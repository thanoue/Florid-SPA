import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, MembershipTypes } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer, MembershipInfo } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { TagService } from 'src/app/services/tag.service';
import { switchMapTo } from 'rxjs/operators';
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
      ShippingSortOrder: 0
    })
      .then(async () => {

        let orderDetails = await this.orderDetailService.getByOrderId(this.orderDetail.OrderId);

        let notCompletedDetails = orderDetails.filter(p => p.State != OrderDetailStates.Completed);

        if (notCompletedDetails.length == 0) {

          this.orderDetailService.updateStatusByOrderId(this.orderDetail.OrderId, OrderDetailStates.Completed, (new Date().getTime()))
            .then(data => {
              this.router.navigate(['staff/orders-manage']);

            });
        }
        else
          this.router.navigate(['staff/orders-manage']);

      });
  }

  shareToCus() {

    this.startLoading();

    this.storageService.downloadFIle(`${environment.base_domain}${IMAGE_FOLDER_PATHS.shipping_img}${this.orderDetail.DeliveryImageUrl}`, (file) => {

      this.stopLoading();

      var reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {

        var base64data = reader.result.toString();
        this.sharingImage = base64data;

        shareImageCusWithData(this.sharingImage, ExchangeService.getMainContact(this.customer));

      }

    });

  }

}
