import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import { OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ChartsModule } from 'ng2-charts';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { MobileSearchBoxComponent } from './controls/mobile-search-box/mobile-search-box.component';
import { PageSegmentComponent } from './controls/page-segment/page-segment.component';
import { SearchBoxComponent } from './controls/search-box/search-box.component';
import { StatusPointComponent } from './controls/status-point/status-point.component';
import { MyCurrPipe, MyDatepipe, MyTimepipe } from './pipes/date.pipe';
import { ImgPipe } from './pipes/img.pipe';
import { AngularImageViewerModule } from 'angular-x-image-viewer';
import { NgxImageCompressService } from 'ngx-image-compress';

// here is the default text string
@Injectable()
export class DefaultIntl extends OwlDateTimeIntl {
    /** A label for the up second button (used by screen readers).  */
    upSecondLabel = 'Add a second';

    /** A label for the down second button (used by screen readers).  */
    downSecondLabel = 'Minus a second';

    /** A label for the up minute button (used by screen readers).  */
    upMinuteLabel = 'Add a minute';

    /** A label for the down minute button (used by screen readers).  */
    downMinuteLabel = 'Minus a minute';

    /** A label for the up hour button (used by screen readers).  */
    upHourLabel = 'Add a hour';

    /** A label for the down hour button (used by screen readers).  */
    downHourLabel = 'Minus a hour';

    /** A label for the previous month button (used by screen readers). */
    prevMonthLabel = 'Previous month';

    /** A label for the next month button (used by screen readers). */
    nextMonthLabel = 'Next month';

    /** A label for the previous year button (used by screen readers). */
    prevYearLabel = 'Previous year';

    /** A label for the next year button (used by screen readers). */
    nextYearLabel = 'Next year';

    /** A label for the previous multi-year button (used by screen readers). */
    prevMultiYearLabel = 'Previous 21 years';

    /** A label for the next multi-year button (used by screen readers). */
    nextMultiYearLabel = 'Next 21 years';

    /** A label for the 'switch to month view' button (used by screen readers). */
    switchToMonthViewLabel = 'Change to month view';

    /** A label for the 'switch to year view' button (used by screen readers). */
    switchToMultiYearViewLabel = 'Choose month and year';

    /** A label for the cancel button */
    cancelBtnLabel = 'Huỷ';

    /** A label for the set button */
    setBtnLabel = 'Lưu';

    /** A label for the range 'from' in picker info */
    rangeFromLabel = 'Từ ngày';

    /** A label for the range 'to' in picker info */
    rangeToLabel = 'Tới ngày';

    /** A label for the hour12 button (AM) */
    hour12AMLabel = 'SA';

    /** A label for the hour12 button (PM) */
    hour12PMLabel = 'CH';
}


@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        QRCodeModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.chasingDots,
            backdropBackgroundColour: 'rgba(0, 0, 0, 0.6)',
            backdropBorderRadius: '4px',
            primaryColour: '#59f2f7',
            secondaryColour: '#59f2f7',
            tertiaryColour: '#59f2f7',
            fullScreenBackdrop: true,
        }),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AngularImageViewerModule,
        DragDropModule],
    declarations: [
        SearchBoxComponent,
        MobileSearchBoxComponent,
        ImgPipe,
        MyDatepipe,
        MyTimepipe,
        PageSegmentComponent,
        StatusPointComponent,
        MyCurrPipe
    ],
    exports: [
        CommonModule,
        FormsModule,
        ChartsModule,
        QRCodeModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule,
        NgxLoadingModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        DragDropModule,
        SearchBoxComponent,
        MobileSearchBoxComponent,
        DatePipe,
        CurrencyPipe,
        ImgPipe,
        MyDatepipe,
        MyTimepipe,
        PageSegmentComponent,
        StatusPointComponent,
        MyCurrPipe,
        AngularImageViewerModule,
    ],
    providers: [
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
        { provide: OwlDateTimeIntl, useClass: DefaultIntl },
        DatePipe,
        CurrencyPipe,
        MyDatepipe,
        MyTimepipe,
        MyCurrPipe,
        ImgPipe,
        NgxImageCompressService
    ],
})
export class SharedModule { }
