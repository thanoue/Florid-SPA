import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppInjector } from './services/common/base.injector';
import { LoginComponent } from './components/admin/login/login.component';
import { MainLayoutComponent } from './components/admin/main-layout/main-layout.component';
import { HomeComponent } from './components/admin/home/home.component';
import { TextBoxComponent } from './controls/text-box/text-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvalidTypeDirective } from './directives/invalid-type.directive';
import { InvalidmessageDirective } from './directives/invalid-message.directive';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData, CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/admin/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import es from '@angular/common/locales/es';
import vi from '@angular/common/locales/vi';
import { OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ProductsComponent } from './components/admin/products/products.component';
import { PageSegmentComponent } from './controls/page-segment/page-segment.component';
import { ProductTagComponent } from './components/admin/product-tag/product-tag.component';
import { ProductCategoryComponent } from './components/admin/product-category/product-category.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CustomersComponent } from './components/admin/customers/customers.component';
import { LocalService } from './services/common/local.service';
import { CustomerDetailComponent } from './components/admin/customer-detail/customer-detail.component';
import { CustomerOrdersComponent } from './components/admin/customer-orders/customer-orders.component';
import { CustomerReceiversComponent } from './components/admin/customer-receivers/customer-receivers.component';
import { CustomerEditComponent } from './components/admin/customer-edit/customer-edit.component';
import { SearchBoxComponent } from './controls/search-box/search-box.component';
import { ImgPipe } from './pipes/img.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StaffLoginComponent } from './components/staff/staff-login/staff-login.component';
import { OrdersManageComponent } from './components/staff/orders-manage/orders-manage.component';
import { StaffMainLayoutComponent } from './components/staff/staff-main-layout/staff-main-layout.component';
import { StatusPointComponent } from './controls/status-point/status-point.component';
import { AddOrderComponent } from './components/staff/add-order/add-order.component';
import { SelectCustomerComponent } from './components/staff/select-customer/select-customer.component';
import { OrderDetailComponent } from './components/staff/order-detail/order-detail.component';
import { SelectProductComponent } from './components/staff/select-product/select-product.component';
import { MobileSearchBoxComponent } from './controls/mobile-search-box/mobile-search-box.component';
import { SelectReceiverComponent } from './components/staff/select-receiver/select-receiver.component';
import { PromotionComponent } from './components/admin/promotion/promotion.component';
import { ViewOrderDetailComponent } from './components/staff/view-order-detail/view-order-detail.component';
import { DatePipe } from '@angular/common';
import { OrderDetailConfirmingComponent } from './components/staff/order-detail-confirming/order-detail-confirming.component';
import { SortOrderChangingComponent } from './components/staff/sort-order-changing/sort-order-changing.component';
import { FloristMainComponent } from './components/staff/florist-main/florist-main.component';
import { CustomerConfirmComponent } from './components/staff/customer-confirm/customer-confirm.component';
import { ShipperMainComponent } from './components/staff/shipper-main/shipper-main.component';
import { FinalConfirmComponent } from './components/staff/final-confirm/final-confirm.component';
import { QRCodeModule } from 'angular2-qrcode';
import { MonthlySummaryComponent } from './components/admin/monthly-summary/monthly-summary.component';
import { ChartSummaryComponent } from './components/admin/chart-summary/chart-summary.component';
import { ChartsModule } from 'ng2-charts';
import { MonthlyChartComponent } from './components/admin/monthly-chart/monthly-chart.component';
import { AdminModule } from './admin/admin.module';

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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    HomeComponent,
    TextBoxComponent,
    InvalidTypeDirective,
    InvalidmessageDirective,
    NotFoundComponent,
    ProductsComponent,
    PageSegmentComponent,
    ProductTagComponent,
    ProductCategoryComponent,
    UsersComponent,
    CustomersComponent,
    CustomerDetailComponent,
    CustomerOrdersComponent,
    CustomerReceiversComponent,
    CustomerEditComponent,
    SearchBoxComponent,
    MobileSearchBoxComponent,
    ImgPipe,
    StaffLoginComponent,
    OrdersManageComponent,
    StaffMainLayoutComponent,
    StatusPointComponent,
    AddOrderComponent,
    SelectCustomerComponent,
    OrderDetailComponent,
    SelectProductComponent,
    SelectReceiverComponent,
    PromotionComponent,
    ViewOrderDetailComponent,
    OrderDetailConfirmingComponent,
    SortOrderChangingComponent,
    FloristMainComponent,
    CustomerConfirmComponent,
    ShipperMainComponent,
    FinalConfirmComponent,
    MonthlySummaryComponent,
    ChartSummaryComponent,
    MonthlyChartComponent,
  ],
  imports: [
    ChartsModule,
    QRCodeModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.chasingDots,
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.6)',
      backdropBorderRadius: '4px',
      primaryColour: '#59f2f7',
      secondaryColour: '#59f2f7',
      tertiaryColour: '#59f2f7',
      fullScreenBackdrop: true,
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DragDropModule,
    AdminModule
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
