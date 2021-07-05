import { BaseEntity } from './base.entity';
import { OrderDetailStates, Roles, OrderType, MakingType } from '../enums';
import { User } from './user.entity';

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
    IsVATIncluded = false;
    Quantity = 1;

    PurposeOf = '';

    IsHardcodeProduct = false;
    HardcodeProductImageName = '';

    CustomerName = '';
    CustomerPhoneNumber = '';

    SeenUsers: ODSeenUserInfo[];

    PercentDiscount: number;
    AmountDiscount: number;

    NoteImages: string[];
    NoteImagesBlobbed: string = '';

    constructor() {

        this.DeliveryInfo = new OrderReceiverDetail();
        this.SeenUsers = [];
        this.NoteImages = [];
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

export class Making {
    Id: number;
    FloristId: number;
    AssignTime: number;
    StartTime: number;
    CompleteTime: number;
    ResultImageUrl: string;
    MakingType: MakingType;
    OrderDetailId: number;

    constructor() {
    }
}

export class Shipping {
    Id: number;
    ShipperId: number;
    AssignTime: number;
    StartTime: number;
    CompleteTime: number;
    DeliveryImageUrl: string;
    OrderDetailId: number;
    Note: string;

    constructor() {
    }
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
