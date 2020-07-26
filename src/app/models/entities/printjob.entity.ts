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
    totalScore: number;

    constructor() {
        super();
        this.saleItems = [];
    }
}

export class PrintSaleItem {
    productName: string;
    index: number;
    price: number;
    additionalFee: number;
}