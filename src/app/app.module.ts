import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { AppComponent } from './app.component';
import { AppInjector } from './services/common/base.injector';
import { DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import vi from '@angular/common/locales/vi';
import { SharedModule } from './shared.module';
import { OwlDateTimeIntl, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/admin/not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

declare function isOnMobile(): any;

// here is the default text string
export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'Add a second';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'Minus a second';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'Add a minute';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'Minus a minute';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'Add a hour';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'Minus a hour';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Previous month';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Next month';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Next year';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 21 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 21 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';

  /** A label for the cancel button */
  cancelBtnLabel = 'Huỷ';

  /** A label for the set button */
  setBtnLabel = 'Lưu';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'Từ ngày';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'Tới ngày';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'SA';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'CH';
};

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: isOnMobile() ? 'staff' : 'admin' },
  { path: 'staff', loadChildren: () => import('./components/staff/staff.module').then(m => m.StaffModule) },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },

  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/staff' },
];


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    SharedModule,
    FormsModule,
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
    DatePipe
  ],
  bootstrap: [AppComponent]

})
export class AppModule {

  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
    registerLocaleData(es);
    registerLocaleData(vi);
  }

}
