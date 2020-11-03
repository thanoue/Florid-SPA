import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { PageComponent } from 'src/app/models/view.models/menu.model';

declare function getLocation(onSuccess: (location: any) => void, onFailed: (location: any) => void): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent {

  protected PageCompnent: PageComponent;

  model: LoginModel = new LoginModel();

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();

    LocalService.clear();
    
  }

  protected Init() {

    this.model.passcode = '123456';
    this.model.userName = 'admin';
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {

      if (isSuccess) {

        this.router.navigate(['/admin/home']);

      } else {

      }

    });

  }
}
