import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { AppInjector } from './services/common/base.injector';
import { DatePipe, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import vi from '@angular/common/locales/vi';
import { SharedModule } from './shared.module';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/admin/not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

declare function isOnMobile(): any;


export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: isOnMobile() ? 'staff' : 'admin' },
  { path: 'staff', loadChildren: () => import('./components/staff/staff.module').then(m => m.StaffModule) },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },

  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: 'staff' },
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
  bootstrap: [AppComponent]

})
export class AppModule {

  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
    registerLocaleData(es);
    registerLocaleData(vi);
  }

}
