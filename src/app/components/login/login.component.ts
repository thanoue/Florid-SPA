import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { OnlineUserService } from 'src/app/services/online.user.service';
import { PageComponent } from 'src/app/models/view.models/menu.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  protected PageCompnent: PageComponent;

  model: LoginModel = new LoginModel();

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();
  }

  protected Init() {

    this.model.passcode = 'test_user';
    this.model.userName = '123456';
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {

      if (isSuccess) {

        this.router.navigate(['']);

      } else {

      }

    });

  }
}
