import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { GlobalService } from './global.service';
import { UserService } from '../user.service';
import { HttpService } from './http.service';
import { API_END_POINT, LOCAL_STORAGE_VARIABLE } from 'src/app/app.constants';
import { OnlineUser } from 'src/app/models/entities/online.user.entity';
import { RealtimeService } from '../realtime.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private realTimeService: RealtimeService, private globalService: GlobalService, private userService: UserService, private httpService: HttpService) {
  }

  static getCurrentRole(): any {
    return LocalService.getRole();
  }

  logOut(signedOutCallback: (isSuccess: boolean) => void) {

    this.realTimeService.disConnect();

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
          LocalService.setIsPrinter(result.isPrinter);
          LocalService.setRole(result.roles[0]);
          LocalService.setUserName(result.fullName);
          LocalService.setUserId(result.id);

          this.realTimeService.connect(result.id, result.isPrinter, () => {
            loginCallback(true);
          });
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
