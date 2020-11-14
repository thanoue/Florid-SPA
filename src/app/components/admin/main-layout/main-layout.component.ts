import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, scan } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/common/global.service';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/common/local.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { PrintJobService } from 'src/app/services/print-job.service';
import { MenuItems } from 'src/app/models/enums';
import { RealtimeService } from 'src/app/services/realtime.service';

declare function initLeftMenu(): any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnDestroy, OnInit {

  navigateClass: string;
  title: string;
  headerUpdate: Subscription;
  currentMenu: MenuItems;

  userName: string;
  userAvt: string;

  menus = MenuItems;

  constructor(private globalService: GlobalService, public router: Router, private realtimeService: RealtimeService, private authService: AuthService) {
  }

  ngOnInit(): void {

    let userId = LocalService.getUserId();
    let isPrinter = LocalService.isPrinter();

    if (userId) {

      this.realtimeService.connect(+userId, isPrinter, () => {

      });

    }

    // this.realtimeService.forceLogoutRegister((message) => {
    //   this.globalService.showError(message);
    //   this.authService.logOut((isSuccess) => {
    //     if (isSuccess) {
    //       this.router.navigate(['/login']);
    //     }
    //   });
    // });

    this.currentMenu = MenuItems.None;

    initLeftMenu();

    this.userName = LocalService.getUserName();
    this.userAvt = LocalService.getUserAvtUrl();

    this.headerUpdate = this.globalService.updateHeader
      .subscribe(pageComponent => {

        if (pageComponent == null) {
          return;
        }

        this.title = pageComponent.Title;
        this.currentMenu = pageComponent.Menu;

      });

  }


  logout() {

    this.authService.logOut(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });

  }

  ngOnDestroy(): void {
    this.headerUpdate.unsubscribe();
  }


}
