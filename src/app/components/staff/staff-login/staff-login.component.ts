import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { Roles } from 'src/app/models/enums';
import { RealtimeService } from 'src/app/services/realtime.service';
import { GoogleService } from 'src/app/services/google.service';
declare function deviceLogin(email: string, pasword: string, isPrinter: boolean, idToken: string): any;
declare function mobileLogin(email: string, pasword: string): any;
declare function savedLoginInforGettingRequest(): any;
@Component({
  selector: 'app-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent extends BaseComponent {

  Title = '';
  NavigateClass = '';

  model: LoginModel = new LoginModel();

  constructor(private router: Router, private googleService: GoogleService, private realtimeService: RealtimeService) {
    super();

    LocalService.clear();
  }

  protected Init() {

    this.setStatusBarColor(true);

    if (this.globalService.isOnMobile()) {
      savedLoginInforGettingRequest();
      return;
    }

    // this.model.passcode = 'aAA123456';
    // // this.model.userName = 'florid.florist.main@floridday.com'; // florist
    // this.model.userName = 'Account2'; //admin
    // //   this.model.userName = 'florid.florist.main@floridday.com'; //florist
    // // this.model.userName = 'florid.shipper.main@floridday.com'; //shipper

  }

  protected savedLoginInforReturn(loginName: string, passcode: string) {
    this.model.passcode = passcode;
    this.model.userName = loginName; //admin
  }

  afterLogin() {
    if (this.globalService.isOnMobile()) {

      this.globalService.isRememberPassWillCheck = true;
      mobileLogin(this.model.userName, this.model.passcode);

    }

    var role = LocalService.getRole();

    switch (role) {
      case Roles.Admin:
      case Roles.Account:
        this.router.navigate(['/staff/orders-manage']);
        break;
      case Roles.Florist:
        this.router.navigate(['staff/florist-main']);
        break;
      case Roles.Shipper:
        this.router.navigate(['staff/shipper-main']);
        break;
    }
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {

        if (!this.globalService.isOnMobile() && !this.googleService.isSignedIn) {
          this.googleService.signIn()
            .then(data => {

              this.ngZone.run(() => {
                this.afterLogin();
              });

            });
        } else {
          this.afterLogin();
        }
      }
    });
  }
}
