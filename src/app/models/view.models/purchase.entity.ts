import { PurchaseMethods } from '../enums';

export class Purchase {
    Id: number;
    Amount: number;
    OrderId: string;
    Method: PurchaseMethods;
    AddingTime: number;
    Note: string;
}