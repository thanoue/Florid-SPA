import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountAndShipperMobileGuard, AccountMobileGuard, FloristMobileGuard, LoggedInGuard, LoggedInMobileGuard, MobileHomeGuard } from 'src/app/guards/login.guard';
import { SharedModule } from 'src/app/shared.module';
import { AddOrderComponent } from './add-order/add-order.component';
import { CustomerConfirmComponent } from './customer-confirm/customer-confirm.component';
import { FinalConfirmComponent } from './final-confirm/final-confirm.component';
import { FloristMainComponent } from './florist-main/florist-main.component';
import { OrderDetailConfirmingComponent } from './order-detail-confirming/order-detail-confirming.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersManageComponent } from './orders-manage/orders-manage.component';
import { SelectCustomerComponent } from './select-customer/select-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { SelectReceiverComponent } from './select-receiver/select-receiver.component';
import { ShipperMainComponent } from './shipper-main/shipper-main.component';
import { SortOrderChangingComponent } from './sort-order-changing/sort-order-changing.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { StaffMainLayoutComponent } from './staff-main-layout/staff-main-layout.component';
import { ViewOrderDetailComponent } from './view-order-detail/view-order-detail.component';
import { HomeComponent } from './home/home.component';
import { ViewPurchaseComponent } from './view-purchase/view-purchase.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';

// routes
export const ROUTES: Routes = [
    { path: 'login', component: StaffLoginComponent },
    {
        path: '',
        component: StaffMainLayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [MobileHomeGuard]
            },
            {
                path: 'add-purchse',
                component: AddPurchaseComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'final-confirm',
                component: FinalConfirmComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'view-purchase',
                component: ViewPurchaseComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'customer-confirming',
                component: CustomerConfirmComponent,
                canActivate: [AccountAndShipperMobileGuard]
            },
            {
                path: 'shipper-main',
                component: ShipperMainComponent,
                canActivate: [AccountAndShipperMobileGuard],
            },
            {
                path: 'sort-order-changing',
                component: SortOrderChangingComponent,
                canActivate: [AccountMobileGuard],
            },
            {
                path: 'florist-main',
                component: FloristMainComponent,
                canActivate: [FloristMobileGuard],
            },
            {
                path: 'order-detail-confirming',
                component: OrderDetailConfirmingComponent,
                canActivate: [AccountAndShipperMobileGuard],
            },
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
            {
                path: 'search-product',
                component: SelectProductComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'add-order',
                component: AddOrderComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'select-receiver',
                component: SelectReceiverComponent,
                canActivate: [AccountMobileGuard]
            },
            {
                path: 'order-detail-view',
                component: ViewOrderDetailComponent,
                canActivate: [LoggedInGuard]
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(ROUTES),
        SharedModule,
    ],
    exports: [RouterModule],
    declarations: [
        HomeComponent,
        StaffLoginComponent,
        OrdersManageComponent,
        StaffMainLayoutComponent,
        AddOrderComponent,
        SelectCustomerComponent,
        OrderDetailComponent,
        SelectProductComponent,
        SelectReceiverComponent,
        ViewOrderDetailComponent,
        OrderDetailConfirmingComponent,
        SortOrderChangingComponent,
        FloristMainComponent,
        CustomerConfirmComponent,
        ShipperMainComponent,
        FinalConfirmComponent,
        HomeComponent,
        ViewPurchaseComponent,
        AddPurchaseComponent]
})
export class StaffModule { }