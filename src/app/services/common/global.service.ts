import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { GenericModel } from 'src/app/models/view.models/generic.model';
import { RouteModel } from 'src/app/models/view.models/route.model';
import { OrderViewModel, OrderDetailViewModel, OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { AlertType } from 'src/app/models/enums';
import { ToastrService } from 'ngx-toastr';
import { OrderReceiverDetail } from 'src/app/models/entities/order.entity';
import { District, Ward } from 'src/app/models/entities/address.entity';
import { Product } from 'src/app/models/entities/product.entity';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { LocalService } from './local.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { Purchase } from 'src/app/models/view.models/purchase.entity';

declare function alert(message: string, alertType: number): any;
declare function isOnMobile(): any;

declare function confirmDialog(message: string, okCallback: () => void, noCallback: () => void, cancelCallback: () => void): any;
declare function openConfirm(message: string, okCallback: () => void, noCallback: () => void, cancelCallback: () => void, yesTitle?: string, noTitle?: string): any;

declare function messageDialog(message: string, okCallback: () => void): any;

declare function hideAdd(): any;
declare function setStatusBarColor(isDark: boolean): any;
declare function isOnTerminal(): any;

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    notifySetup: any;

    spinnerInvoke: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    updateHeader: BehaviorSubject<PageComponent> = new BehaviorSubject<PageComponent>(null);

    mobileUpdateHeader: BehaviorSubject<RouteModel> = new BehaviorSubject<RouteModel>(null);

    private loadingCount = 0;

    currentOrderViewModel: OrderViewModel;
    currentOrderDetailViewModel: OrderDetailViewModel;
    currentDistricts: District[];
    currentPurchases: Purchase[];
    currentWards: Ward[];
    globalCustomer: Customer;
    isEdittingOrder = false;
    isRememberPassWillCheck = false;
    currentOrderPage = 0;
    currentCustomerPage = 1;
    selectedOrderId = '';
    currentOrderListScrollPos = 0;
    displayStatuses: any[] = [];

    navigateOnClick = new Subject<boolean>();
    navigateOnClickEmitter$ = this.navigateOnClick.asObservable;

    constructor(private toastr: ToastrService, private ngZone: NgZone) {

        this.currentDistricts = [];
        this.currentWards = [];
        this.currentPurchases = [];

        this.notifySetup = { timeOut: 5000, tapToDismiss: true, progressBar: false, progressAnimation: 'decreasing', positionClass: 'toast-bottom-full-width', closeButton: true, extendedTimeOut: 9000 };

        const key = 'ToastReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            toastShowing: (message, alertType) => this.toastTrShowing(message, alertType),

        };
    }


    startLoading() {

        if (this.loadingCount === 0) {
            this.spinnerInvoke.next(true);
        }
        this.loadingCount++;

        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
        }
    }

    stopLoading() {

        if (this.loadingCount <= 1) {
            this.spinnerInvoke.next(false);
        }

        this.loadingCount--;

        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
        }
    }

    isOnMobile(): any {
        return isOnMobile();
    }

    setStatusBarColor(isDark: boolean) {
        setStatusBarColor(isDark);
    }

    updateHeaderInfo(info: PageComponent) {
        this.updateHeader.next(info);
    }

    updaterMobileHeaderInfo(info: RouteModel) {
        this.mobileUpdateHeader.next(info);
    }

    clickOnNavigateButton() {
        this.navigateOnClick.next(true);
    }

    isRunOnTerimal(): boolean {
        return isOnTerminal();
    }


    toastTrShowing(message: string, alertType: number) {
        switch (alertType) {
            case AlertType.Error:
                this.toastr.error(message, 'Lỗi', this.notifySetup);
                break;
            case AlertType.Info:
                this.toastr.info(message, 'Thông tin', this.notifySetup);
                break;
            case AlertType.Success:
                this.toastr.success(message, 'Thành công', this.notifySetup);
                break;
            case AlertType.Warning:
                this.toastr.warning(message, 'Cảnh báo', this.notifySetup);
                break;
            default:
                break;
        }
    }

    showError(message: string) {
        alert(message, +AlertType.Error);
    }

    showInfo(message: string) {
        alert(message, +AlertType.Info);
    }

    showSuccess(message: string) {
        alert(message, +AlertType.Success);
    }

    showWarning(message: string) {
        alert(message, +AlertType.Warning);
    }

    openConfirm(message: string, okCallback: () => void, noCallback?: () => void, cancelCallback?: () => void) {
        confirmDialog(message, okCallback, noCallback, cancelCallback);
    }

    openMobileConfirm(message: string, okCallback: () => void, noCallback?: () => void, cancelCallback?: () => void, yesTitle?: string, noTitle?: string) {
        openConfirm(message, okCallback, noCallback, cancelCallback, yesTitle, noTitle);
    }

    openMessage(message: string, okCallback?: () => void) {
        messageDialog(message, okCallback);
    }

    hidePopup() {
        hideAdd();
    }
}
