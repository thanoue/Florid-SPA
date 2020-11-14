import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalService } from './common/local.service';
import { PrintJobService } from './print-job.service';

declare function connectSocket(host, connectedCallback: () => void): any;
declare function login(userId: number, isPrinter: boolean): any;
declare function disConnectSocket(): any;
declare function forceLogoutRegister(callback: (message: string) => void, failCallback: (message: string) => void): any;
declare function registerPrintEvent(connectedCallback: (printJob: any) => void): any;

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(private printJobService: PrintJobService) { }

  connect(userId: number, isPrinter: boolean, callback: () => void) {
    disConnectSocket();
    connectSocket(environment.base_domain, () => {

      callback();

      login(userId, isPrinter);

      if (isPrinter) {

        registerPrintEvent((printJob) => {
          console.log(printJob);
          this.printJobService.doPrintJob(printJob);
        });

      }

    });
  }

  disConnect() {
    disConnectSocket();
  }

  forceLogoutRegister(callback: (message: string) => void) {

    forceLogoutRegister(callback, () => {

      let userId = LocalService.getUserId();
      let isPrinter = LocalService.isPrinter();

      if (userId) {
        this.connect(+userId, isPrinter, () => {
          this.forceLogoutRegister(callback);
        });
      }

    });
  }

}
