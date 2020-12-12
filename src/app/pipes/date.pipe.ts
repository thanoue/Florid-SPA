import { CurrencyPipe, DatePipe } from '@angular/common';
import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({ name: 'myDatePipe' })
export class MyDatepipe implements PipeTransform {
    transform(date: Date | number, format: string = 'dd/MM/yyyy'): string {

        if (typeof date === "number") {
            let d = new Date(date);

            return new DatePipe('vi-VN').transform(d, format) + " ";
        }

        if (date == null || date == undefined)
            return '';

        return new DatePipe('vi-VN').transform(date, format) + " ";
    }
}

@Pipe({ name: 'myTimePipe' })
export class MyTimepipe implements PipeTransform {
    
    transform(date: Date | number, format: string = 'HH:mm'): string {

        if (typeof date === "number") {
            let d = new Date(date);

            return new DatePipe('vi-VN').transform(d, format) + " ";
        }

        if (date == null || date == undefined)
            return '';

        return new DatePipe('vi-VN').transform(date, format) + " ";
    }
}

@Pipe({ name: 'myCurrPipe' })
export class MyCurrPipe implements PipeTransform {

    transform(value: number, ...args: any[]): any {
        return new CurrencyPipe('vi-VN').transform(value, 'VND', 'symbol-narrow', '', 'vi-VN');
    }

    static currencyFormat(value: number): string {
        return new CurrencyPipe('vi-VN').transform(value, 'VND', 'symbol-narrow', '', 'vi-VN');
    }


}