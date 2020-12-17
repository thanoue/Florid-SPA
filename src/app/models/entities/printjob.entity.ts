import { BaseEntity } from './base.entity';

export class PrintJob extends BaseEntity {

    saleItems: PrintSaleItem[];
    createdDate: string;
    orderId: string;
    summary: number;
    totalAmount: number;
    totalPaidAmount: number;
    totalBalance: number;
    vatIncluded: boolean;
    memberDiscount: number;
    scoreUsed: number;
    gainedScore: number;
    customerId: string;
    totalScore: number;
    customerName: string;
    discount: number;
    purchaseItems: purchaseItem[];
    isMemberDiscountApply: boolean;

    constructor() {
        super();
        this.saleItems = [];
        this.purchaseItems = [];
    }
}

export class purchaseItem {
    method: string;
    amount: number;
    status: string;
}

export class PrintSaleItem {
    productName: string;
    index: number;
    price: number;
    quantity: number;
    additionalFee: number;
    discount: number;
}