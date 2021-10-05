import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, scan } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/common/global.service';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/common/local.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { PrintJobService } from 'src/app/services/print-job.service';
import { RealtimeService } from 'src/app/services/realtime.service';
@Component({
  selector: 'app-staff-main-layout',
  templateUrl: './staff-main-layout.component.html',
  styleUrls: ['./staff-main-layout.component.css']
})
export class StaffMainLayoutComponent implements OnDestroy, OnInit {


  navigateClass: string;
  title: string;
  headerUpdate: Subscription;

  logoutInvoker: Subscription;

  constructor(
    public router: Router,
    private globalService: GlobalService,
    private authService: AuthService,
    private realtimeService: RealtimeService) {

    this.navigateClass = '';
    this.title = '';

    this.headerUpdate = this.globalService.mobileUpdateHeader
      .subscribe(headerInfo => {

        if (headerInfo === null || !headerInfo) {
          return;
        }

        this.updateHeaderBar(headerInfo.Title, headerInfo.NavigateClass);

      });

  }

  ngOnInit(): void {

    this.logoutInvoker = this.realtimeService.LogouOutBehavier.subscribe(res => {

      if (res === false) {
        return;
      }

      this.authService.logOut((isSuccess) => {

        if (isSuccess) {
          this.router.navigate(['/staff/login']);
        }

      });

    });

    const userId = LocalService.getUserId();

    if (userId) {

      this.realtimeService.connect(+userId, LocalService.getRole(), () => {

      });

    }

    this.globalService.setStatusBarColor(false);

  }



  public updateHeaderBar(title: string, navigateClass: string) {
    setTimeout(() => {
      this.navigateClass = navigateClass;
      this.title = title;
    }, 100);
  }

  ngOnDestroy(): void {

    this.headerUpdate.unsubscribe();
    this.logoutInvoker.unsubscribe();

  }

  navigateOnClick() {
    this.globalService.clickOnNavigateButton();
  }
}
