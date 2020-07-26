import { MembershipTypes, CusContactInfoTypes } from '../models/enums';
import { Injectable } from '@angular/core';
import { OrderDetailDeliveryInfo } from '../models/view.models/order.model';
import { OrderReceiverDetail, CustomerReceiverDetail } from '../models/entities/order.entity';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';
import { Customer } from '../models/entities/customer.entity';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExchangeService {

    static getMemberDiscountPercent(membershipTypes: MembershipTypes): number {
        switch (membershipTypes) {
            case MembershipTypes.NewCustomer:
                return 0;
            case MembershipTypes.Member:
                return 5;
            case MembershipTypes.Vip:
                return 10;
            case MembershipTypes.VVip:
                return 15;
        }
    }

    static detectCustomerId(count: number): string {
        if (count > 9999) {
            return `FD-${count.toString()}`;
        }

        if (count > 999) {
            return `FD-0${count.toString()}`
        }

        if (count > 99) {
            return `FD-00${count.toString()}`
        }

        if (count > 9) {
            return `FD-000${count.toString()}`
        }

        return `FD-0000${count.toString()}`
    }

    static getFullImgUrl(relativeFolderPath: string, fileName: string): string {
        console.log(fileName);
        return fileName.indexOf('http') >= 0 ? fileName : `${environment.base_domain}${relativeFolderPath}${fileName}`;
    }

    static getMainContact(customer: Customer): string {
        switch (customer.MainContactInfo) {
            case CusContactInfoTypes.Facebook:
                return customer.ContactInfo.Facebook;
            case CusContactInfoTypes.Zalo:
                return customer.ContactInfo.Zalo;
            case CusContactInfoTypes.Skype:
                return customer.ContactInfo.Skype;
            case CusContactInfoTypes.Viber:
                return customer.ContactInfo.Viber;
            case CusContactInfoTypes.Instagram:
                return customer.ContactInfo.Instagram;
            default:
                return customer.ContactInfo.Zalo;
        }
    }

    static getFinalPrice(requestPrice: number, discountPercent: number, additionalFee: number) {
        return requestPrice - (requestPrice / 100) * discountPercent + additionalFee;
    }

    static getGainedScore(totalAmount: number): number {
        return totalAmount / 100000;
    }

    static geExchangableAmount(gainedScore: number) {
        return gainedScore * 1000;
    }

    static receiverInfoCompare(item1: CustomerReceiverDetail, item2: CustomerReceiverDetail): boolean {
        if (item1.Address !== item2.Address
            || item1.FullName !== item2.FullName
            || item1.PhoneNumber !== item2.PhoneNumber) {
            return false;
        } else {
            return true;
        }
    }

    static deliveryInfoCompare(item1: OrderDetailDeliveryInfo, item2: OrderDetailDeliveryInfo): boolean {
        if (!this.dateCompare(item1.DateTime, item2.DateTime)
            || item1.Address !== item2.Address
            || item1.FullName !== item2.FullName
            || item1.PhoneNumber !== item2.PhoneNumber) {
            return false;
        } else {
            return true;
        }
    }

    static dateCompare(first: Date, second: Date): boolean {
        if (first.getFullYear() !== second.getFullYear()
            || first.getMonth() !== second.getMonth()
            || first.getDate() !== second.getDate()
            || first.getHours() !== second.getHours()
            || first.getMinutes() !== second.getMinutes()) {
            return false;
        } else {
            return true;
        }
    }


    static getTimeFromExcel(res: any): number {
        if (res && res != '') {

            if (res.toString().indexOf('/') > -1) {

                var nums = res.split('/', 3);

                console.log(nums);
                if (nums.length == 3) {
                    let year = parseInt(nums[2]);
                    let month = parseInt(nums[1]) - 1;
                    let day = parseInt(nums[0]);

                    let date = new Date(year, month, day, 0, 0, 0, 0);

                    return date.getTime();

                }
            } else {

                let dateVal = parseInt(res);
                var date = new Date((dateVal - (25567 + 2)) * 86400 * 1000)
                return date.getTime();
            }

        } else
            return 0;
    }

    static stringPriceToNumber(res: string): number {
        // tslint:disable-next-line: no-debugger
        const length = res.length;
        const num = res.substring(0, length - 1);
        const finalString = num.replace(/,/g, '');
        const final = parseFloat(finalString);

        return final ? final : 0;
    }

    static getAlias(source: string): string {

        if (!source) {
            return '';
        }

        var str = source.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim().replace(/ /g, '-');

        return str;
    }
}
