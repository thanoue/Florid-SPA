import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare function connectSocket(host, connectedCallback: () => void): any;
declare function login(userId: number): any;
declare function disConnectSocket(): any;
declare function forceLogoutRegister(callback: (message: string) => void): any;

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor() { }

  connect(userId: number) {
    connectSocket(environment.base_domain, () => {
      console.log('connected');
      login(userId);
    });
  }

  disConnect() {
    disConnectSocket();
  }

  forceLogoutRegister(callback: (message: string) => void) {
    forceLogoutRegister(callback);
  }

}
