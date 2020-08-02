import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AppInjector } from '../../services/common/base.injector';
import { GlobalService } from '../../services/common/global.service';
import { AuthService } from '../../services/common/auth.service';
import { RouteModel } from '../../models/view.models/route.model';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { DistrictAddressService } from '../../services/address/district-address.service';
import { WardAddressService } from '../../services/address/ward-address.service';
import { District, Ward } from '../../models/entities/address.entity';
import { LocalService } from '../../services/common/local.service';
import { Roles } from '../../models/enums';

declare function pickFile(isSaveUrl: boolean): any;
declare function addressRequest(districts: District[], resCallback: (res: string) => void, onDistrictChange: (res: string, newWardCallback: (wards: Ward[]) => void) => void): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    abstract Title: string;
    protected IsDataLosingWarning = true;
    protected NavigateClass = 'prev-icon';

    protected globalService: GlobalService;
    protected authService: AuthService;
    protected location: Location;

    private ngZone: NgZone;
    private navigateOnClick: Subscription;
    private districtService: DistrictAddressService;
    private wardService: WardAddressService;

    public IsOnTerminal: boolean;

    get globalOrder(): OrderViewModel {
        return this.globalService.currentOrderViewModel;
    }
    set globalOrder(value: OrderViewModel) {
        this.globalService.currentOrderViewModel = value;
    }

    get globalOrderDetail(): OrderDetailViewModel {
        return this.globalService.currentOrderDetailViewModel;
    }
    set globalOrderDetail(value: OrderDetailViewModel) {
        this.globalService.currentOrderDetailViewModel = value;
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

    get CurrentUser(): { Id: string, FullName: string, Role: Roles, Avt: string, PhoneNumber: string } {
        return {
            FullName: LocalService.getUserName(),
            Role: LocalService.getRole() as Roles,
            Avt: LocalService.getUserAvtUrl(),
            Id: LocalService.getUserId(),
            PhoneNumber: LocalService.getPhoneNumber()
        }
    }

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

        const key = 'BaseReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            dateTimeSelected: (year, month, day, hour, minute) => this.dateTimeSelected(year, month, day, hour, minute),
            forceBackNavigate: () => this.backNavigateOnClick(),
            fileChosen: (path) => this.fileChosen(path)
        };

        this.IsOnTerminal = this.globalService.isRunOnTerimal();
        this.Init();
    }

    ngOnDestroy(): void {
        this.navigateOnClick.unsubscribe();
        this.destroy();
    }

    ngAfterViewInit(): void {

        this.globalService.updaterMobileHeaderInfo(new RouteModel(this.Title, this.NavigateClass));

        this.navigateOnClick = this.globalService.navigateOnClick
            .subscribe((res) => {

                if (!res) {
                    return;
                }

                this.backNavigateOnClick();
            });
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

    protected dateTimeSelected(year: number, month: number, day: number, hour: number, minute: number) {

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

    public openFile() {
        pickFile(false);
    }

    public openFileForShare() {
        pickFile(true);
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }

    protected setStatusBarColor(isDark: boolean) {
        this.globalService.setStatusBarColor(isDark);
    }


    protected OnBackNaviage() {
        this.location.back();
    }

    private backNavigateOnClick() {

        if (this.IsDataLosingWarning) {
            this.openConfirm('Dữ liệu hiện tại sẽ bị mất! Bạn có chắc chắn?', () => {
                this.OnBackNaviage();
            });

        } else {
            this.OnBackNaviage();
        }
    }

    protected abstract Init();

    protected destroy() {

    }

    protected fileChosen(path: string) {

    }

    protected openConfirm(message: string, okCallback: () => void, noCallback?: () => void, cancelCallback?: () => void) {
        this.globalService.openMobileConfirm(message, okCallback, noCallback, cancelCallback);
    }
}
