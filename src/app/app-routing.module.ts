import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuard, AdminGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductTagComponent } from './components/product-tag/product-tag.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { UsersComponent } from './components/users/users.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerEditComponent } from './components/customer-edit/customer-edit.component';
import { CustomerReceiverDetail } from './models/entities/order.entity';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { CustomerReceiversComponent } from './components/customer-receivers/customer-receivers.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
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
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
