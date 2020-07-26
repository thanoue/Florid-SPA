import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppInjector } from '../services/common/base.injector';
import { GenericModel } from '../models/view.models/generic.model';
import { GlobalService } from '../services/common/global.service';
import { AuthService } from '../services/common/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouteModel } from '../models/view.models/route.model';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { OrderViewModel, OrderDetailViewModel } from '../models/view.models/order.model';
import { DistrictAddressService } from '../services/address/district-address.service';
import { WardAddressService } from '../services/address/ward-address.service';
import { District, Ward } from '../models/entities/address.entity';
import { PageComponent } from '../models/view.models/menu.model';
import { Customer } from '../models/entities/customer.entity';

declare function addressRequest(districts: District[], resCallback: (res: string) => void, onDistrictChange: (res: string, newWardCallback: (wards: Ward[]) => void) => void): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    protected abstract PageCompnent: PageComponent;

    protected globalService: GlobalService;
    protected authService: AuthService;
    protected location: Location;
    private ngZone: NgZone;
    private districtService: DistrictAddressService;
    private wardService: WardAddressService;

    get globalCustomer(): Customer {
        return this.globalService.globalCustomer;
    }

    set globalCustomer(val: Customer) {
        this.globalService.globalCustomer = val;
    }

    get globalDistricts(): District[] {
        return this.globalService.currentDistricts;
    }

    set globalDistricts(value: District[]) {
        this.globalService.currentDistricts = value;
    }

    get globalwards(): Ward[] {
        return this.globalService.currentWards;
    }

    set globalwards(value: Ward[]) {
        this.globalService.currentWards = value;
    }

    protected abstract Init(): any;

    constructor() {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.authService = injector.get(AuthService);
        this.location = injector.get(Location);
        this.ngZone = injector.get(NgZone);
        this.districtService = injector.get(DistrictAddressService);
        this.wardService = injector.get(WardAddressService);
    }


    ngOnInit(): void {

        setTimeout(() => {
            this.globalService.updateHeader.next(this.PageCompnent);
            this.Init();
        }, 200);

    }

    ngOnDestroy(): void {
        this.destroy();
    }

    ngAfterViewInit(): void {

    }

    protected selectAddress(resCallback: (res: string) => void) {

        if (this.globalwards.length <= 0) {

            this.districtService.getAll().then(dists => {

                this.globalDistricts = dists;

                this.wardService.getAll().then(wards => {

                    this.globalwards = wards;

                    this.addressRequest(resCallback);
                });
            });

        } else {
            this.addressRequest(resCallback);
        }
    }

    private addressRequest(resCallback: (res: string) => void) {

        addressRequest(this.globalDistricts, resCallback, (districtId, newwardCallback) => {
            const newWards = this.globalwards.filter(p => p.DistrictId === districtId);
            newwardCallback(newWards);
        });

    }

    showError(message: string) {
        this.globalService.showError(message);
    }

    showInfo(message: string) {
        this.globalService.showInfo(message);
    }

    showSuccess(message: string) {
        this.globalService.showSuccess(message);
    }

    showWarning(message: string) {
        this.globalService.showWarning(message);
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }


    protected destroy() {

    }

    protected openConfirm(message: string, okCallback: () => void, noCallback?: () => void, cancelCallback?: () => void) {
        this.globalService.openConfirm(message, okCallback, noCallback, cancelCallback);
    }
}
