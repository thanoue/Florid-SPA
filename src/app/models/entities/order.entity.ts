import { BaseEntity } from './base.entity';
import { OrderDetailStates, Roles, OrderType } from '../enums';

export class Order extends BaseEntity {
    CustomerId = '';
    AccountId = '';
    VATIncluded = false;
    TotalAmount = 0;
    TotalPaidAmount = 0;
    OrderType: OrderType;
    NumberId: number;
    IsMemberDiscountApply: boolean;

    GainedScore = 0;
    ScoreUsed = 0;

    PercentDiscount = 0;
    AmountDiscount = 0;

    DoneTime: number;
    Index: number;
}

export class OrderDetail {
    Id = 0;
    OrderId = '';
    AdditionalFee = 0;
    ProductId = 0;
    ProductName = '';
    ProductImageUrl = '';
    ProductModifiedPrice = 0;
    ProductPrice = 0;
    TotalAmount = 0;
    DeliveryInfo: OrderReceiverDetail;
    Description = '';
    Index = -1;
    State = OrderDetailStates.Added;
    MakingSortOrder = 0;
    ShippingSortOrder = 0;
    IsVATIncluded = false;
    Quantity = 1;

    PurposeOf = '';

    IsHardcodeProduct = false;
    HardcodeProductImageName = '';

    CustomerName = '';
    CustomerPhoneNumber = '';


    FloristInfo: ODFloristInfo;
    ShipperInfo: ODShipperInfo;

    SeenUsers: ODSeenUserInfo[];

    ResultImageUrl: string;
    DeliveryImageUrl: string;

    PercentDiscount: number;
    AmountDiscount: number

    constructor() {

        this.DeliveryInfo = new OrderReceiverDetail();
        this.FloristInfo = new ODFloristInfo();
        this.ShipperInfo = new ODShipperInfo();
        this.SeenUsers = [];
    }
}

export class ODSeenUserInfo {

    FullName: string;
    UserId: string;
    Role: Roles;
    Avt: string;
    SeenTime: number;

    static DeepCopy(model: ODSeenUserInfo): ODSeenUserInfo {

        var vm = new ODSeenUserInfo();

        vm.Avt = model.Avt;
        vm.FullName = model.FullName;
        vm.Role = model.Role;
        vm.UserId = model.UserId;
        vm.SeenTime = model.SeenTime;

        return vm;
    }
}

export class ODFloristInfo {
    Id: string;
    FullName: string;
    AssignTime: number;
    CompletedTime: number;
}

export class ODShipperInfo {
    Id: string;
    FullName: string;
    AssignTime: number;
    CompletedTime: number;
}

export class OrderReceiverDetail {

    ReceivingTime = 0;
    ReceiverDetail: CustomerReceiverDetail;

    constructor() {
        this.ReceiverDetail = new CustomerReceiverDetail();
    }
}

export class CustomerReceiverDetail {
    FullName: string = '';
    PhoneNumber: string = '';
    Address: string = '';
}
