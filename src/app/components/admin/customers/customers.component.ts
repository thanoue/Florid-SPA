import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, MembershipTypes } from 'src/app/models/enums';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/common/exchange.service';
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

  _selectedMemberType: MembershipTypes = MembershipTypes.All;
  public get selectedMemberType(): MembershipTypes {
    return this._selectedMemberType;
  }

  public set selectedMemberType(val: MembershipTypes) {
    this._selectedMemberType = val;
    this.searchTerm = '';
    this.pageChanged(1);
  }

  currentCustomer: Customer;

  customers: {
    Customer: Customer,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number = 10;

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
    this.selectedMemberType = MembershipTypes.All;
    this._itemsPerPage = 10;
  }

  addRequest() {
    this.currentCustomer = new Customer();
    this.currentCustomer.Id = ExchangeService.detectCustomerId(this.totalCount);
    showCustomerSetupPopup();
  }

  viewCusDetail(cus: Customer) {
    this.globalCustomer = cus;
    this.router.navigate(['admin/customer-detail']);
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
      this.searchTerm = '';
      this.pageChanged(1);
      return;
    }

    this.searchTerm = term;
    this._selectedMemberType = MembershipTypes.All;
    this.pageChanged(1);

  }

  protected Init() {

    this.pageChanged(1, () => {
      this.customerService.getCount().then(res => {
        this.totalCount = res + 1;
      });
    });
  }

  pageChanged(page: number, callbac?: () => void) {

    this.currentPage = page;
    this.customerService.getList(page, this._itemsPerPage, this.selectedMemberType, this.searchTerm)
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

        if (callbac)
          callbac();

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

    let ids: string[] = []

    seletedcustomers.forEach(cus => {
      ids.push(cus.Customer.Id);
    })

    this.openConfirm('Chắc chắn xoá những khách hàng này ?', () => {
      this.customerService.deleteMany(ids)
        .then(() => {
          this.pageChanged(1);
        })

    });
  }

  deleteCustomer(customer: Customer) {

    this.openConfirm('Chắc chắn xoá khách hàng?', () => {

      this.customerService.delete(customer.Id)
        .then(() => {
          this.pageChanged(this.currentPage);
        })
    });
  }


}
