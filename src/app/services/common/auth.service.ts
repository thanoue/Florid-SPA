import { Injectable, NgZone } from '@angular/core';
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

  constructor(private realTimeService: RealtimeService,
    private globalService: GlobalService,
    private userService: UserService,
    private httpService: HttpService,
    private ngZone: NgZone) {
  }

  static getCurrentRole(): any {
    return LocalService.getRole();
  }

  logOut(signedOutCallback: (isSuccess: boolean) => void) {

    this.httpService.post(API_END_POINT.logout)
      .then(() => {

        this.realTimeService.disConnect();

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

    this.globalService.startLoading();

    this.httpService.post(API_END_POINT.login, {
      loginName: model.userName,
      password: model.passcode
    }, false)
      .then(result => {

        if (!result) {
          loginCallback(false);
          return;
        }

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
          this.ngZone.run(() => {
            this.globalService.stopLoading();
            loginCallback(true);
          });
        });

      })
      .catch(err => {

        this.httpService.handleError(err);

        loginCallback(false);

        console.warn(err);

        return;

      });

  }
}
