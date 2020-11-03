export class Promotion {
    Id: number;
    Name: string;
    Amount: number;
    PromotionType: PromotionType;
    StartTime: number;
    EndTime: number;
    IsEnable: boolean;
}

export enum PromotionType {
    Amount,
    Percent
}