import {
    Pipe,
    PipeTransform
} from '@angular/core';

import { ImgType, IMAGE_FOLDER_PATHS } from '../app.constants';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'ImgPipe',
})
export class ImgPipe implements PipeTransform {
    transform(value: string, imgType: string): string {

        if (!value || value == undefined) {
            return '../../../assets/images/temp.png';
        }

        if (value.indexOf('http') >= 0) {
            return value;
        }

        if (value.length >= 300)
            return value;

        switch (imgType) {
            case ImgType.UserAvt:
                return `${environment.base_domain}${IMAGE_FOLDER_PATHS.user_avt}${value}`;
            case ImgType.ProductImg:
                return `${environment.base_domain}${IMAGE_FOLDER_PATHS.product_img}${value}`;
            case ImgType.ProductImg:
                return `${environment.base_domain}${IMAGE_FOLDER_PATHS.product_img}${value}`;
            case ImgType.ShippingImg:
                return `${environment.base_domain}${IMAGE_FOLDER_PATHS.shipping_img}${value}`;
            case ImgType.ResultImg:
                return `${environment.base_domain}${IMAGE_FOLDER_PATHS.result_img}${value}`;

        }
    }
}