import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { OnlineUserService } from 'src/app/services/online.user.service';
import { Roles } from 'src/app/models/enums';
declare function deviceLogin(email: string, pasword: string, isPrinter: boolean, idToken: string): any;
@Component({
  selector: 'app-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent extends BaseComponent {

  Title = '';
  NavigateClass = '';

  model: LoginModel = new LoginModel();

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();
    LocalService.clear();

  }

  protected Init() {

    this.setStatusBarColor(true);

    this.model.passcode = '123456';
    // this.model.userName = 'florid.florist.main@floridday.com'; // florist
    this.model.userName = 'admin'; //admin
    //   this.model.userName = 'florid.florist.main@floridday.com'; //florist
    // this.model.userName = 'florid.shipper.main@floridday.com'; //shipper

  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {

        var role = LocalService.getRole();

        switch (role) {
          case Roles.Admin:
          case Roles.Account:
            this.router.navigate(['/staff/orders-manage']);
            break;
          case Roles.Florist:
            this.router.navigate(['/florist-main']);
            break;
          case Roles.Shipper:
            this.router.navigate(['/shipper-main']);
            break;
        }


      }
    });

  }
}
