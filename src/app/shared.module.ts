import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import {  OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ChartsModule } from 'ng2-charts';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { MobileSearchBoxComponent } from './controls/mobile-search-box/mobile-search-box.component';
import { PageSegmentComponent } from './controls/page-segment/page-segment.component';
import { SearchBoxComponent } from './controls/search-box/search-box.component';
import { StatusPointComponent } from './controls/status-point/status-point.component';
import { ImgPipe } from './pipes/img.pipe';

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
        DragDropModule],
    declarations: [
        SearchBoxComponent,
        MobileSearchBoxComponent,
        ImgPipe,
        PageSegmentComponent,
        StatusPointComponent
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
        ImgPipe,
        PageSegmentComponent,
        StatusPointComponent,
    ]
})
export class SharedModule { }