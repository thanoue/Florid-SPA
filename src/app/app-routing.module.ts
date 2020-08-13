import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/admin/login/login.component';
import { LoggedInGuard, AdminGuard, AccountMobileGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/admin/main-layout/main-layout.component';
import { HomeComponent } from './components/admin/home/home.component';
import { NotFoundComponent } from './components/admin/not-found/not-found.component';
import { ProductsComponent } from './components/admin/products/products.component';
import { ProductTagComponent } from './components/admin/product-tag/product-tag.component';
import { ProductCategoryComponent } from './components/admin/product-category/product-category.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CustomersComponent } from './components/admin/customers/customers.component';
import { CustomerDetailComponent } from './components/admin/customer-detail/customer-detail.component';
import { CustomerEditComponent } from './components/admin/customer-edit/customer-edit.component';
import { CustomerOrdersComponent } from './components/admin/customer-orders/customer-orders.component';
import { CustomerReceiversComponent } from './components/admin/customer-receivers/customer-receivers.component';
import { StaffLoginComponent } from './components/staff/staff-login/staff-login.component';
import { StaffMainLayoutComponent } from './components/staff/staff-main-layout/staff-main-layout.component';
import { OrdersManageComponent } from './components/staff/orders-manage/orders-manage.component';
import { SelectCustomerComponent } from './components/staff/select-customer/select-customer.component';
import { OrderDetailComponent } from './components/staff/order-detail/order-detail.component';

const routes: Routes = [
  { path: 'staff-login', component: StaffLoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'staff',
    component: StaffMainLayoutComponent,
    children: [
      {
        path: 'orders-manage',
        canActivate: [AccountMobileGuard],
        component: OrdersManageComponent
      },
      {
        path: 'select-customer',
        component: SelectCustomerComponent,
        canActivate: [AccountMobileGuard]
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent,
        canActivate: [AccountMobileGuard]
      },
    ]
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'product-tags',
        component: ProductTagComponent,
      },
      {
        path: 'product-categories',
        component: ProductCategoryComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customer-detail',
        component: CustomerDetailComponent,
      },
      {
        path: 'customer-orders',
        component: CustomerOrdersComponent,
      },
      {
        path: 'customer-edit',
        component: CustomerEditComponent,
      },
      {
        path: 'customer-receivers',
        component: CustomerReceiversComponent,
      }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/admin/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
