import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roles } from '../models/enums';
import { AuthService } from './common/auth.service';
import { LocalService } from './common/local.service';
import { PrintJobService } from './print-job.service';

declare function connectSocket(host, connectedCallback: () => void, logoutallback: (mess: string) => void): any;
declare function login(userId: number, isPrinter: boolean, role: any): any;
declare function disConnectSocket(): any;
declare function forceLogoutRegister(callback: (message: string) => void, failCallback: (message: string) => void): any;
declare function registerPrintEvent(connectedCallback: (printJob: any) => void): any;
declare function forceAccountLogout(userId: any): any;

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  LogouOutBehavier = new Subject<boolean>();
  LogouOutBehavierEmitter$ = this.LogouOutBehavier.asObservable;

  constructor(private printJobService: PrintJobService) { }

  connect(userId: number, isPrinter: boolean, role: any, callback: () => void) {

    disConnectSocket();

    connectSocket(environment.base_domain, () => {

      callback();

      login(userId, isPrinter, role);

      if (isPrinter) {

        registerPrintEvent((printJob) => {
          console.log(printJob);
          this.printJobService.doPrintJob(printJob);
        });

      }

    }, (mess) => {
      this.LogouOutBehavier.next(true);
    });
  }

  forceAccountLogout() {
    forceAccountLogout(LocalService.getUserId());
  }

  disConnect() {
    disConnectSocket();
  }

}
