import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, MembershipTypes } from 'src/app/models/enums';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare function showCustomerSetupPopup(): any;
declare function hideAdd(): any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent extends BaseComponent {


  protected PageCompnent: PageComponent = new PageComponent('Khách hàng', MenuItems.Customer);

  isSelectAll: boolean = false;
  currentPage = 1;
  sexes = Sexes;
  searchTerm = '';
  totalCount = 0;

  currentCustomer: Customer;

  customers: {
    Customer: Customer,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {
    this._itemsPerPage = val;

    this.pageChanged(1);
  }

  constructor(private customerService: CustomerService, private router: Router) {
    super();
    this.currentCustomer = new Customer();
  }

  addRequest() {
    this.currentCustomer = new Customer();
    this.currentCustomer.Id = ExchangeService.detectCustomerId(this.totalCount);
    showCustomerSetupPopup();
  }

  viewCusDetail(cus: Customer) {
    this.globalCustomer = cus;
    this.router.navigate(['customer-detail']);
  }

  addCustomer(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.currentCustomer.MembershipInfo.AccumulatedAmount *= 1000;

    this.currentCustomer.MembershipInfo.AvailableScore = ExchangeService.getGainedScore(this.currentCustomer.MembershipInfo.AccumulatedAmount) - this.currentCustomer.MembershipInfo.UsedScoreTotal;

    if (this.currentCustomer.MembershipInfo.AvailableScore < 0) {
      this.showError('Điểm đã sử dụng không hợp lệ!');
      this.currentCustomer.MembershipInfo.AccumulatedAmount /= 1000;
      return;
    }


    this.currentCustomer.Birthday = new Date(this.currentCustomer.Birthday).getTime();
    this.customerService.createCustomer(this.currentCustomer)
      .then(cus => {
        this.pageChanged(this.currentPage);
        this.customerService.getCount().then(res => {
          this.totalCount = res + 1
        });
        hideAdd();
      });

  }

  searchCustomer(term) {

    this.customers = [];

    if (term == '') {
      this.pageChanged(1);
      return;
    }

    this.searchTerm = term;
    this.pageChanged(1);

  }

  protected Init() {
    this._itemsPerPage = 10;
    this.pageChanged(1);
    this.customerService.getCount().then(res => {
      this.totalCount = res + 1
    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.customerService.getList(page, this._itemsPerPage, this.searchTerm)
      .then(data => {
        this.customers = [];
        this.itemTotalCount = data.totalItemCount;
        this.pageCount = data.totalPages;

        data.Customers.forEach(customer => {
          this.customers.push({
            Customer: customer,
            IsChecked: false
          });

        });

      });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.customers.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

  deletecustomers() {

    var seletedcustomers = this.customers.filter(p => p.IsChecked);

    if (seletedcustomers.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá những khách hàng này ?', () => {

      this.startLoading();


    });
  }

  deleteCustomer(customer: Customer) {

    this.openConfirm('Chắc chắn xoá khách hàng?', () => {

      this.startLoading();

    });
  }


}
