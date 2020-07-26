import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/entities/user.entity';
import * as firebase from 'firebase';
import { GlobalService } from './global.service';
import { UserService } from '../user.service';
import { HttpService } from './http.service';
import { API_END_POINT, LOCAL_STORAGE_VARIABLE } from 'src/app/app.constants';
import { OnlineUserService } from '../online.user.service';
import { OnlineUser } from 'src/app/models/entities/online.user.entity';
import { FunctionsService } from './functions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private onlineUserService: OnlineUserService, private globalService: GlobalService, private userService: UserService, private httpService: HttpService) {
  }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  logOut(signedOutCallback: (isSuccess: boolean) => void) {


    this.httpService.post(API_END_POINT.logout)
      .then(() => {

        LocalService.clear();

        this.globalService.stopLoading();
        signedOutCallback(true);

      })
      .catch(err => {
        LocalService.clear();
        this.globalService.stopLoading();
        signedOutCallback(true);
        throw err;
      });

  }

  login(model: LoginModel, loginCallback: (isSuccess: boolean) => void) {

    try {
      this.httpService.post(API_END_POINT.login, {
        loginName: model.userName,
        password: model.passcode
      }, true)
        .then(result => {

          this.globalService.stopLoading();
          LocalService.clear();

          LocalService.setUserEmail(result.email);
          LocalService.setApiAccessToken(result.accessToken);
          LocalService.setUserAvtUrl(result.avtUrl);
          LocalService.setPhoneNumber(result.phoneNumber);
          LocalService.setIsPrinter(result.phoneNumber);
          LocalService.setRole(result.roles[0]);
          LocalService.setUserName(result.fullName);
          LocalService.setUserId(result.id);

          loginCallback(true);

        })
        .catch(err => {
          this.globalService.stopLoading();
          this.globalService.showError(err.error.message);
          return;
        });
    }
    catch (exception) {
      console.log(exception);
      this.globalService.stopLoading();
      loginCallback(false);
      return;
    }

  }
}
