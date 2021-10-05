import { Component, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Customer } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { NgForm } from '@angular/forms';
import { MembershipTypes } from 'src/app/models/enums';
import { OrderCustomerInfoViewModel } from 'src/app/models/view.models/order.model';
import { ExchangeService } from 'src/app/services/common/exchange.service';

declare function closeAddCustomerDialog(): any;
declare function viewCustomerInfo(): any;
declare function setSelectedCustomerItem(id: string): any;

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css']
})
export class SelectCustomerComponent extends BaseComponent {

  Title = 'Chọn khách hàng';
  newCustomer: Customer;
  customers: Customer[];
  selectedCustomer: Customer;
  protected IsDataLosingWarning = false;
  totalCount = 0;

  // tslint:disable-next-line:variable-name
  constructor(private customerService: CustomerService, private _ngZone: NgZone) {
    super();

    this.selectedCustomer = new Customer();
    const key = 'searchProdReference';
    this.newCustomer = new Customer();
    this.customers = [];
    this.selectedCustomer = new Customer();

    window[key] = {
      component: this, zone: this._ngZone,
      itemSelected: (data) => this.setSelectedCustomer(data)
    };

  }

  setSelectedCustomer(id: string) {
    this.selectedCustomer = this.customers.filter(p => p.Id === id)[0];

    const menuItems = ['Chọn Khách hàng',
      'Xem thông tin chi tiết'];

    this.menuOpening((pos) => {
      switch (+pos) {
        case 0:

          this.selectConfirm();

          break;

        case 1:

          viewCustomerInfo();

          break;
      }

    }, menuItems);
  }

  protected Init() {

    this.customerService.getCount().then(res => {

      this.totalCount = res + 1;
      this.newCustomer.Id = ExchangeService.detectCustomerId(this.totalCount);

    });

    this.selectedCustomer = new Customer();

    if (this.globalOrder.CustomerInfo) {
      this.searchCustomer(this.globalOrder.CustomerInfo.PhoneNumber);
    }

  }

  addCustomer(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.selectedCustomer = new Customer();

    const customer = new Customer();

    customer.FullName = this.newCustomer.FullName;
    customer.PhoneNumber = this.newCustomer.PhoneNumber;
    customer.Sex = this.newCustomer.Sex;
    customer.MembershipInfo.MembershipType = MembershipTypes.NewCustomer;
    customer.MembershipInfo.AccumulatedAmount = 0;
    customer.MembershipInfo.AvailableScore = 0;
    customer.MembershipInfo.UsedScoreTotal = 0;
    customer.Id = this.newCustomer.Id;

    this.customerService.createCustomer(customer).then(res => {

      this.newCustomer = new Customer();

      this.selectedCustomer = customer;

      this.customers.push(customer);

      this.globalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

      closeAddCustomerDialog();

      setSelectedCustomerItem(this.selectedCustomer.Id);

      this.totalCount += 1;
      this.newCustomer = new Customer();
      this.newCustomer.Id = ExchangeService.detectCustomerId(this.totalCount);

    });

  }

  selectConfirm() {

    if (this.selectedCustomer == null) {
      this.showError('Chưa chọn khách hàng nào cả!!!');
      return;
    }

    if (this.globalOrder.CustomerInfo.Id === this.selectedCustomer.Id) {
      this.OnBackNaviage();
      return;
    }

    this.globalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

    this.OnBackNaviage();

  }

  searchCustomer(term) {

    if (!term || term === '') {
      this.customers = [];
      return;
    }

    this.customerService.getList(-1, -1, MembershipTypes.All, term)
      .then(data => {

        this.customers = data.Customers;

        setTimeout(() => {
          if (this.globalOrder.CustomerInfo.Id) {
            setSelectedCustomerItem(this.globalOrder.CustomerInfo.Id);
            this.selectedCustomer = data.Customers.find(p => p.Id === this.globalOrder.CustomerInfo.Id);
          }
        }, 50);

      });
  }


}
