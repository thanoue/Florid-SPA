import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AppInjector } from '../../services/common/base.injector';
import { GlobalService } from '../../services/common/global.service';
import { AuthService } from '../../services/common/auth.service';
import { RouteModel } from '../../models/view.models/route.model';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { AddressService } from '../../services/address.service';
import { District, Ward } from '../../models/entities/address.entity';
import { LocalService } from '../../services/common/local.service';
import { Roles } from '../../models/enums';

declare function pickFile(isSaveUrl: boolean): any;
declare function isRememberPassChecking(): any;
declare function passwordSaving(): any;
declare function passwordClearing(): any;
declare function addressRequest(districts: District[], resCallback: (res: string) => void, onDistrictChange: (res: string, newWardCallback: (wards: Ward[]) => void) => void): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    abstract Title: string;
    protected IsDataLosingWarning = true;
    protected NavigateClass = 'prev-icon';

    protected globalService: GlobalService;
    protected authService: AuthService;
    protected location: Location;

    protected ngZone: NgZone;
    private navigateOnClick: Subscription;
    private addressService: AddressService;

    public IsOnTerminal: boolean;

    get isEdittingOrder(): boolean {
        return this.globalService.isEdittingOrder;
    }

    set isEdittingOrder(isEditting: boolean) {
        this.globalService.isEdittingOrder = isEditting;
    }

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

    get CurrentUser(): { Id: number, FullName: string, Role: Roles, Avt: string, PhoneNumber: string } {
        return {
            FullName: LocalService.getUserName(),
            Role: LocalService.getRole() as Roles,
            Avt: LocalService.getUserAvtUrl(),
            Id: LocalService.getUserId(),
            PhoneNumber: LocalService.getPhoneNumber(),
        }
    }

    constructor() {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.authService = injector.get(AuthService);
        this.location = injector.get(Location);
        this.ngZone = injector.get(NgZone);
        this.addressService = injector.get(AddressService);
    }

    ngOnInit(): void {

        const key = 'BaseReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            dateTimeSelected: (year, month, day, hour, minute) => this.dateTimeSelected(year, month, day, hour, minute),
            forceBackNavigate: () => this.backNavigateOnClick(),
            fileChosen: (path) => this.fileChosen(path),
            printConfirm: (callback) => this.printConfirm(callback),
            rememberPassConfirm: () => this.rememberPassConfirm(),
            savedLoginInforReturn: (loginName, passcode) => this.savedLoginInforReturn(loginName, passcode)
        };

        this.IsOnTerminal = this.globalService.isRunOnTerimal();
        this.Init();

    }

    protected savedLoginInforReturn(loginName: string, passcode: string) {

    }

    askForRememberPassword() {
        if (this.globalService.isRememberPassWillCheck) {
            this.globalService.isRememberPassWillCheck = false;
            if (this.globalService.isOnMobile()) {
                isRememberPassChecking();
            }
        }
    }

    rememberPassConfirm() {
        this.openConfirm('Bạn muốn lưu thông tin đăng nhập?', () => {
            passwordSaving();
        }, () => {
            passwordClearing();
        });
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

    printConfirm(continueCallback: () => void) {
        this.openConfirm('In thêm bản?', () => {
            continueCallback();
        }, () => {
        });
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
