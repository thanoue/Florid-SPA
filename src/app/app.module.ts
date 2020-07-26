import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AppInjector } from './services/common/base.injector';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { TextBoxComponent } from './controls/text-box/text-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvalidTypeDirective } from './directives/invalid-type.directive';
import { InvalidmessageDirective } from './directives/invalid-message.directive';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData, CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import es from '@angular/common/locales/es';
import vi from '@angular/common/locales/vi';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ProductsComponent } from './components/products/products.component';
import { PageSegmentComponent } from './controls/page-segment/page-segment.component';
import { ProductTagComponent } from './components/product-tag/product-tag.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { UsersComponent } from './components/users/users.component';
import { CustomersComponent } from './components/customers/customers.component';
import { LocalService } from './services/common/local.service';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CustomerReceiversComponent } from './components/customer-receivers/customer-receivers.component';
import { CustomerEditComponent } from './components/customer-edit/customer-edit.component';
import { SearchBoxComponent } from './controls/search-box/search-box.component';
import { ImgPipe } from './pipes/img.pipe';

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
    ImgPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
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
