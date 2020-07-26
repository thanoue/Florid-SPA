import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, MembershipTypes } from 'src/app/models/enums';
import { Customer } from 'src/app/models/entities/customer.entity';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Khách hàng', MenuItems.Customer);

  get customer(): Customer {
    return this.globalCustomer;
  }

  protected Init() {
  }

  constructor() {
    super();
  }

  getMemberShipName(type: MembershipTypes) {
    switch (type) {
      case MembershipTypes.NewCustomer:
        return 'KH mới';
      case MembershipTypes.Member:
        return 'Member (giảm giá 5%)';
      case MembershipTypes.Vip:
        return 'Vip (giảm giá 10%)';
      case MembershipTypes.VVip:
        return 'VVip (giảm giá 15%)';
    }
  }
}
