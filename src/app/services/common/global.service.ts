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

declare function alert(message: string, alertType: number): any;
declare function confirmDialog(message: string, okCallback: () => void, noCallback: () => void, cancelCallback: () => void): any;
declare function messageDialog(message: string, okCallback: () => void): any;
declare function hideAdd(): any;

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    notifySetup: any;

    spinnerInvoke: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    updateHeader: BehaviorSubject<PageComponent> = new BehaviorSubject<PageComponent>(null);

    private loadingCount = 0;

    currentDistricts: District[];
    currentWards: Ward[];
    globalCustomer: Customer;


    constructor(private toastr: ToastrService, private ngZone: NgZone) {

        this.currentDistricts = [];
        this.currentWards = [];

        this.notifySetup = { timeOut: 5000, tapToDismiss: true, progressBar: false, progressAnimation: 'decreasing', positionClass: 'toast-bottom-full-width', closeButton: true, extendedTimeOut: 9000 };

        const key = 'ToastReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            toastShowing: (message, alertType) => this.toastTrShowing(message, alertType)
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

    openMessage(message: string, okCallback?: () => void) {
        messageDialog(message, okCallback);
    }

    hidePopup() {
        hideAdd();
    }
}
