import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
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
    PromotionComponent
  ],
  imports: [
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
    DragDropModule
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
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
