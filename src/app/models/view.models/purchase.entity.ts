import { PurchaseMethods } from '../enums';
import { Customer } from '../entities/customer.entity';

export class Purchase {
    Id: number;
    Amount: number;
    OrderId: string;
    Method: PurchaseMethods;
    AddingTime: number;
    Note: string;
    Customer: Customer;

    constructor() {
        this.Customer = new Customer();
    }
}