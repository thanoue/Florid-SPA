import { BaseEntity } from './base.entity';

export class MomoTrans extends BaseEntity {
    MomoTransId: string;
    TransType: string;
    Amount: number;
    ResponseTime: number;
    StoreId: string;
    Status: number;
    OrderInfo: string;
    RequestId: string;
}