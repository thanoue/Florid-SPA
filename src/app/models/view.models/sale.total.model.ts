export class SaleTotalModel {
    OrderId: string;
    CustomerId: string;
    CustomerName: string;
    CustomerPhoneNumber: string;
    CreatedDate: Date;

    FeeTotal: number;
    AmountTotal: number;
    FinalTotal: number;
    PriceTotal: number;
    DiscountTotal: number;
    IsVATIncluded: boolean;
    TotalPaidAmount : number;
}