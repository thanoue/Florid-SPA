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
    console.log(this.orderDetail);

    this.customerService.getById(this.globalOrder.CustomerInfo.Id).then(customer => {
      this.customer = customer;
    });

  }

  constructor(private router: Router, private orderDetailService: OrderDetailService, private storageService: StorageService, private customerService: CustomerService) {
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

        let notCompletedDetails = orderDetails.filter(p => p.State != OrderDetailStates.Completed && p.State != OrderDetailStates.Canceled);

        if (notCompletedDetails && notCompletedDetails.length > 0) {

          this.router.navigate(['staff/orders-manage']);

          return;

        } else {

          let totalAmount = this.globalOrder.TotalAmount;

          orderDetails.forEach(detail => {
            if (detail.State == OrderDetailStates.Canceled) {
              totalAmount -= (detail.ModifiedPrice + detail.AdditionalFee);
            }
          });

          let newMemberInfo = new MembershipInfo();
          newMemberInfo.AccumulatedAmount = this.customer.MembershipInfo.AccumulatedAmount + totalAmount;
          newMemberInfo.AvailableScore = this.customer.MembershipInfo.AvailableScore - this.globalOrder.CustomerInfo.ScoreUsed + ExchangeService.getGainedScore(totalAmount);
          newMemberInfo.UsedScoreTotal = this.customer.MembershipInfo.UsedScoreTotal + this.globalOrder.CustomerInfo.ScoreUsed;

          newMemberInfo.MembershipType = ExchangeService.detectMemberShipType(newMemberInfo.AccumulatedAmount);

          console.log(newMemberInfo);

          this.customerService.updateFields(this.customer.Id, {
            UsedScoreTotal: newMemberInfo.UsedScoreTotal,
            AvailableScore: newMemberInfo.AvailableScore,
            AccumulatedAmount: newMemberInfo.AccumulatedAmount,
            MembershipType: newMemberInfo.MembershipType,
          }).then((res) => {
            setTimeout(() => {
              this.router.navigate(['staff/orders-manage']);
            }, 200);
          });
        }

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
