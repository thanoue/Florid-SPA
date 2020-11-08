import { PurchaseStatus, PurchaseMethods } from '../enums';

export class Purchase {
    Id: number;
    Amount: number;
    OrderId: string;
    Status: PurchaseStatus;
    Method: PurchaseMethods;
}