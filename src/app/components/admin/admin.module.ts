import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/guards/login.guard';
import { SharedModule } from 'src/app/shared.module';
import { ChartSummaryComponent } from './chart-summary/chart-summary.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomerReceiversComponent } from './customer-receivers/customer-receivers.component';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MonthlyChartComponent } from './monthly-chart/monthly-chart.component';
import { MonthlySummaryComponent } from './monthly-summary/monthly-summary.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductTagComponent } from './product-tag/product-tag.component';
import { ProductsComponent } from './products/products.component';
import { PromotionComponent } from './promotion/promotion.component';
import { UsersComponent } from './users/users.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { DebtsComponent } from './debts/debts.component';
import { ConfigComponent } from './config/config.component';

// routes
export const ROUTES: Routes = [
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
            },
            {
                path: 'promotion',
                component: PromotionComponent,
            },
            {
                path: 'monthly-summary',
                component: MonthlySummaryComponent,
            },
            {
                path: 'chart-summary',
                component: ChartSummaryComponent,
            },
            {
                path: 'monthly-chart',
                component: MonthlyChartComponent,
            },
            {
                path: 'purchases',
                component: PurchasesComponent,
            },
            {
                path: 'debts',
                component: DebtsComponent,
            },
            {
                path: 'config',
                component: ConfigComponent,
            }
        ]
    },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [RouterModule],
    declarations: [
        LoginComponent,
        MainLayoutComponent,
        HomeComponent,
        ProductsComponent,
        ProductTagComponent,
        ProductCategoryComponent,
        UsersComponent,
        CustomersComponent,
        CustomerDetailComponent,
        CustomerOrdersComponent,
        CustomerEditComponent,
        CustomerReceiversComponent,
        PromotionComponent,
        MonthlySummaryComponent,
        ChartSummaryComponent,
        MonthlyChartComponent,
        LoginComponent,
        PurchasesComponent,
        DebtsComponent,
        ConfigComponent
    ]
})
export class AdminModule { }
