import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailViewModel, OrderViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';
import { ResultImage, DeliveryImage } from 'src/app/models/entities/file.entity';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/entities/order.entity';
import { OrderService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { basename } from 'path';

declare function shareImageCus(contactInfo: string): any;
declare function shareImageCusWithData(img: string, contactInfo: string): any;
declare function deleteTempImage(): any;
declare function getShippingNoteDialog(btnTitle: string, callback: (note: string) => void): any;
declare function getNumberValidateInput(resCallback: (res: number, validCallback: (isvalid: boolean, error: string) => void) => void, placeHolder: string, oldValue: number): any;

@Component({
  selector: 'app-customer-confirm',
  templateUrl: './customer-confirm.component.html',
  styleUrls: ['./customer-confirm.component.css']
})
export class CustomerConfirmComponent extends BaseComponent {

  Title = 'Xác nhận với khách hàng';
  edittingImageUrl: string = '';
  selectedBlob: Blob;
  orderDetail: OrderDetailViewModel;
  order: OrderViewModel;
  totalBalance = 0;
  customer: Customer;

  constructor(private orderDetailService: OrderDetailService,
    private customerService: CustomerService,
    private router: Router,
    private orderService: OrderService) {
    super();

    this.orderDetail = new OrderDetailViewModel();
    this.order = new OrderViewModel();
    this.customer = new Customer();
  }

  protected Init() {

    this.orderDetail = this.globalOrderDetail;

    this.orderService.getById(this.orderDetail.OrderId)
      .then(order => {

        this.order = order;
        this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

        this.customerService.getById(this.order.CustomerInfo.Id)
          .then(cus => {
            this.customer = cus;
          });

      });

  }

  protected fileChosen(path: string) {

    this.edittingImageUrl = 'data:image/png;base64,' + path;

  }

  onChange(event) {

    const filesUpload: File = event.target.files[0];

    if (!filesUpload)
      return;

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {

      this.edittingImageUrl = reader.result.toString();

    }
  }

  destroy() {
    super.destroy();
    deleteTempImage();
  }

  shipperCofirm() {
    getShippingNoteDialog('Xác nhận', (note) => {
      this.confirm(note);
    });
  }

  confirm(note: string) {

    switch (this.CurrentUser.Role) {

      case Roles.Account:
      case Roles.Admin:

        if (this.edittingImageUrl != '') {
          fetch(this.edittingImageUrl)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "result.png", { type: "image/png" });
              this.orderDetailService.resultConfirm(this.orderDetail.OrderDetailId, file)
                .then(res => {
                  this.router.navigate(['staff/account-main']);
                });
            });
        }

        break;

      case Roles.Shipper:

        if (this.edittingImageUrl != '') {

          fetch(this.edittingImageUrl)
            .then(res => res.blob())
            .then(blob => {

              const file = new File([blob], "shipping.png", { type: "image/png" });

              this.orderDetailService.shippingConfirm(this.orderDetail.OrderDetailId, file, note)
                .then(res => {
                  this.router.navigate(['staff/shipper-main']);
                });

            })

        } else {

          this.orderDetailService.updateFields(this.orderDetail.OrderDetailId, {
            DeliveryCompletedTime: (new Date()).getTime(),
            State: OrderDetailStates.Deliveried,
            MakingSortOrder: 0,
            ShippingSortOrder: 0,
            ShippingNote: note
          }).then(data => {
            this.router.navigate(['staff/shipper-main']);
          });

        }

        break;
      default:
        break;
    }

  }

  shareForCus() {

    if (this.edittingImageUrl == '') {
      return;
    }

    if (this.IsOnTerminal) {

      shareImageCus(ExchangeService.getMainContact(this.customer));

    } else {

      shareImageCusWithData(this.edittingImageUrl, ExchangeService.getMainContact(this.customer));

    }
  }
}
