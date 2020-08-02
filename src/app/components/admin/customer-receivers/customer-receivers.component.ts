import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { CustomerReceiverDetail } from 'src/app/models/entities/order.entity';
import { NgForm } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
declare function showReceiverSetupPopup(): any;
@Component({
  selector: 'app-customer-receivers',
  templateUrl: './customer-receivers.component.html',
  styleUrls: ['./customer-receivers.component.css']
})
export class CustomerReceiversComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Thông tin nhận hàng', MenuItems.Customer);
  receivers: CustomerReceiverDetail[];
  currentReceiver: CustomerReceiverDetail;
  currentIndex = -1;

  protected Init() {
    this.receivers = this.globalCustomer.ReceiverInfos ? this.globalCustomer.ReceiverInfos : [];
  }

  constructor(private customerService: CustomerService) { super(); this.currentReceiver = new CustomerReceiverDetail(); }

  addReceiverShow() {
    showReceiverSetupPopup();
    this.currentReceiver = new CustomerReceiverDetail();
    this.currentIndex = -1;
  }

  editReceiver(index) {
    Object.assign(this.currentReceiver, this.receivers[index]);
    showReceiverSetupPopup();
    this.currentIndex = index;
  }

  protected destroy() {
    this.globalCustomer.ReceiverInfos = this.receivers;
    this.startLoading();  
    // this.customerService.updateSingleField(this.globalCustomer.Id, 'ReceiverInfos', this.currentReceiver).then(() => {
    //   this.stopLoading();
    // });
  }

  removeReceiver(index) {
    this.receivers.splice(index, 1);
  }

  addReceiver(form: NgForm) {

    if (form.invalid)
      return;

    if (this.currentIndex == -1) {
      this.receivers.push(this.currentReceiver);
    }
    else {
      this.receivers[this.currentIndex] = this.currentReceiver;
    }

    this.currentIndex = -1;
    this.currentReceiver = new CustomerReceiverDetail();

    this.globalService.hidePopup();
  }

}
