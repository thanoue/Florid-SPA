import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AppInjector } from '../../services/common/base.injector';
import { GlobalService } from '../../services/common/global.service';
import { AuthService } from '../../services/common/auth.service';
import { Location } from '@angular/common';
import { District, Ward } from '../../models/entities/address.entity';
import { PageComponent } from '../../models/view.models/menu.model';
import { Customer } from '../../models/entities/customer.entity';
import { AddressService } from 'src/app/services/address.service';

declare function addressRequest(districts: District[], resCallback: (res: string) => void, onDistrictChange: (res: string, newWardCallback: (wards: Ward[]) => void) => void): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    protected abstract PageCompnent: PageComponent;

    protected globalService: GlobalService;
    protected authService: AuthService;
    protected location: Location;
    private addressService: AddressService;
    protected ngZone: NgZone;

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
        this.addressService = injector.get(AddressService);
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

            this.addressService.getAllDistrict().then(dists => {

                this.globalDistricts = dists;

                this.addressService.getAllWards().then(wards => {

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
