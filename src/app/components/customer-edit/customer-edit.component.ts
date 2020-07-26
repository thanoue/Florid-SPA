import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { MenuItems } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { Customer, SpecialDay } from 'src/app/models/entities/customer.entity';
import { NgForm } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent extends BaseComponent {

  customer: Customer;


  protected PageCompnent: PageComponent = new PageComponent('Sửa thông tin khách hàng', MenuItems.Customer);
  protected Init() {
    this.customerService.getById(this.globalCustomer.Id)
      .then(cus => {
        this.customer = cus;
      });
  }

  constructor(private customerService: CustomerService, private router: Router) { super(); }

  editCustomer(form: NgForm) {

    if (form.invalid)
      return;

    let specialDays: SpecialDay[] = [];

    if (this.customer.SpecialDays) {
      this.customer.SpecialDays.forEach(day => {

        if (day.Description && day.Description != '') {

          specialDays.push({
            Description: day.Description,
            Date: new Date(day.Date).getTime()
          });

        }

      });
    }


    this.customer.SpecialDays = specialDays;

    this.customer.Birthday = new Date(this.customer.Birthday).getTime();

    if (!this.customer.Birthday || this.customer.Birthday == NaN)
      this.customer.Birthday = 0;

    this.customer.MembershipInfo.AvailableScore = ExchangeService.getGainedScore(this.customer.MembershipInfo.AccumulatedAmount) - this.customer.MembershipInfo.UsedScoreTotal;

    if (this.customer.MembershipInfo.AvailableScore < 0) {
      this.showError('Điểm đã sử dụng vượt quá tổng điểm!');
      return;
    }


  }

  addSpecialDay() {

    let newDate = new SpecialDay();
    newDate.Date = (new Date()).getTime();

    if (!this.customer.SpecialDays)
      this.customer.SpecialDays = [];


    this.customer.SpecialDays.push(newDate);

    console.log(this.customer.SpecialDays);

  }
}
