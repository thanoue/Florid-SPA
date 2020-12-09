import { OrderDetailStates, OrderType } from '../../models/enums';
import { MembershipTypes } from '../enums';
import { Customer, SpecialDay } from '../entities/customer.entity';
import { ExchangeService } from '../../services/exchange.service';
import { CustomerReceiverDetail, OrderDetail, Order, ODFloristInfo, ODShipperInfo, ODSeenUserInfo } from '../entities/order.entity';
import { Purchase } from './purchase.entity';

export class OrderViewModel {

    OrderId: string;
    TotalAmount: number;
    TotalPaidAmount: number;
    CreatedDate: Date;
    VATIncluded = false;
    OrderType: OrderType;
    DoneTime: number;
    Index: number;

    PercentDiscount = 0;
    AmountDiscount = 0;

    CustomerInfo: OrderCustomerInfoViewModel;

    OrderDetails: OrderDetailViewModel[];

    PurchaseItems: Purchase[];

    constructor() {
        this.PurchaseItems = [];
        this.OrderDetails = [];
        this.CustomerInfo = new OrderCustomerInfoViewModel();
        this.TotalAmount = 0;
        this.TotalPaidAmount = 0;
        this.OrderId = '';
    }
}

export class OrderDetailViewModel {

    ProductName = '';
    OrderDetailId = 0;
    OrderId = '';
    OrderIndex = 0;
    State = OrderDetailStates.Waiting;
    ProductId = 0;
    ProductImageUrl = '';
    Quantity = 1;
    Index = 0;
    DeliveryInfo: OrderDetailDeliveryInfo;
    PurposeOf = '';

    OriginalPrice = 0;
    ModifiedPrice = 0;
    AdditionalFee = 0;

    MakingSortOrder = 0;
    ShippingSortOrder = 0;
    IsVATIncluded = false;
    Description = '';

    CustomerName = '';
    CustomerPhoneNumber = '';

    IsFromHardCodeProduct = false;
    HardcodeImageName = '';

    FloristInfo: ODFloristInfo;
    ShipperInfo: ODShipperInfo;

    ResultImageUrl: string;
    DeliveryImageUrl: string;

    PercentDiscount: number;
    AmountDiscount: number;

    ShippingSessionId: number;

    MakingRequestTime: number;
    DeliveryCompletedTime: number;
    MakingStartTime: number;
    MakingCompletedTime: number;
    MakingNote: string;
    ShippingNote: string;
    FixingFloristId: number;

    SeenUsers: ODSeenUserInfo[];

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
        this.FloristInfo = new ODFloristInfo();
        this.ShipperInfo = new ODShipperInfo();
        this.SeenUsers = [];
    }

    // static ToViewModel(entity: OrderDetail) {
    //     const vm = new OrderDetailViewModel();

    //     vm.CustomerName = entity.CustomerName;
    //     vm.CustomerPhoneNumber = entity.CustomerPhoneNumber;
    //     vm.IsVATIncluded = entity.IsVATIncluded;
    //     vm.OrderDetailId = entity.Id;
    //     vm.OrderId = entity.OrderId;
    //     vm.AdditionalFee = entity.AdditionalFee;
    //     vm.Description = entity.Description;
    //     vm.Index = entity.Index;

    //     vm.MakingSortOrder = entity.MakingSortOrder;
    //     vm.ShippingSortOrder = entity.ShippingSortOrder;

    //     vm.ModifiedPrice = entity.ProductModifiedPrice;
    //     vm.ProductId = entity.Id;
    //     vm.OriginalPrice = entity.ProductPrice;
    //     vm.ProductImageUrl = entity.ProductImageUrl;
    //     vm.ProductName = entity.ProductName;

    //     vm.IsFromHardCodeProduct = entity.IsHardcodeProduct;
    //     vm.HardcodeImageName = entity.HardcodeProductImageName;

    //     vm.PurposeOf = entity.PurposeOf;

    //     vm.DeliveryInfo.DateTime = new Date(entity.DeliveryInfo.ReceivingTime);
    //     vm.DeliveryInfo.Address = entity.DeliveryInfo.ReceiverDetail.Address;
    //     vm.DeliveryInfo.FullName = entity.DeliveryInfo.ReceiverDetail.FullName;
    //     vm.DeliveryInfo.PhoneNumber = entity.DeliveryInfo.ReceiverDetail.PhoneNumber;

    //     vm.ResultImageUrl = entity.ResultImageUrl;
    //     vm.DeliveryImageUrl = entity.DeliveryImageUrl;

    //     vm.State = entity.State;
    //     vm.Quantity = 1;

    //     if (entity.SeenUsers && entity.SeenUsers.length > 0) {
    //         entity.SeenUsers.forEach(user => {
    //             vm.SeenUsers.push(ODSeenUserInfo.DeepCopy(user));
    //         });
    //     }

    //     if (entity.FloristInfo) {
    //         vm.FloristInfo.Id = entity.FloristInfo.Id;
    //         vm.FloristInfo.AssignTime = entity.FloristInfo.AssignTime;
    //         vm.FloristInfo.CompletedTime = entity.FloristInfo.CompletedTime;
    //         vm.FloristInfo.FullName = entity.FloristInfo.FullName;
    //     }

    //     if (entity.ShipperInfo) {
    //         vm.ShipperInfo.Id = entity.ShipperInfo.Id;
    //         vm.ShipperInfo.AssignTime = entity.ShipperInfo.AssignTime;
    //         vm.ShipperInfo.CompletedTime = entity.ShipperInfo.CompletedTime;
    //         vm.ShipperInfo.FullName = entity.ShipperInfo.FullName;
    //     }

    //     return vm;
    // }

    static DeepCopy(model: OrderDetailViewModel) {

        const viewModel = new OrderDetailViewModel();

        viewModel.DeliveryCompletedTime = model.DeliveryCompletedTime;
        viewModel.MakingNote = model.MakingNote;
        viewModel.MakingCompletedTime = model.MakingCompletedTime;
        viewModel.MakingStartTime = model.MakingStartTime;
        viewModel.ShippingSessionId = model.ShippingSessionId;
        viewModel.MakingRequestTime = model.MakingRequestTime;
        viewModel.ResultImageUrl = model.ResultImageUrl;
        viewModel.DeliveryImageUrl = model.DeliveryImageUrl;
        viewModel.CustomerName = model.CustomerName;
        viewModel.CustomerPhoneNumber = model.CustomerPhoneNumber;
        viewModel.IsVATIncluded = model.IsVATIncluded;
        viewModel.ProductName = model.ProductName;
        viewModel.OrderDetailId = model.OrderDetailId;
        viewModel.State = model.State;
        viewModel.ProductId = model.ProductId;
        viewModel.ProductImageUrl = model.ProductImageUrl;
        viewModel.Quantity = model.Quantity;
        viewModel.Index = model.Index;
        viewModel.DeliveryInfo = OrderDetailDeliveryInfo.DeepCopy(model.DeliveryInfo);
        viewModel.OriginalPrice = model.OriginalPrice;
        viewModel.ModifiedPrice = model.ModifiedPrice;
        viewModel.AdditionalFee = model.AdditionalFee;
        viewModel.Description = model.Description;
        viewModel.IsFromHardCodeProduct = model.IsFromHardCodeProduct;
        viewModel.ShippingSortOrder = model.ShippingSortOrder;
        viewModel.MakingSortOrder = model.MakingSortOrder;
        viewModel.PurposeOf = model.PurposeOf;
        viewModel.PercentDiscount = model.PercentDiscount;
        viewModel.AmountDiscount = model.AmountDiscount;
        viewModel.ShippingNote = model.ShippingNote;
        viewModel.FixingFloristId = model.FixingFloristId;

        if (model.SeenUsers && model.SeenUsers.length > 0) {
            model.SeenUsers.forEach(user => {
                viewModel.SeenUsers.push(ODSeenUserInfo.DeepCopy(user));
            });
        }

        if (model.FloristInfo) {
            viewModel.FloristInfo.Id = model.FloristInfo.Id;
            viewModel.FloristInfo.AssignTime = model.FloristInfo.AssignTime;
            viewModel.FloristInfo.CompletedTime = model.FloristInfo.CompletedTime;
            viewModel.FloristInfo.FullName = model.FloristInfo.FullName;
        }

        if (model.ShipperInfo) {
            viewModel.ShipperInfo.Id = model.ShipperInfo.Id;
            viewModel.ShipperInfo.AssignTime = model.ShipperInfo.AssignTime;
            viewModel.ShipperInfo.CompletedTime = model.ShipperInfo.CompletedTime;
            viewModel.ShipperInfo.FullName = model.ShipperInfo.FullName;
        }

        return viewModel;
    }
}

export class OrderDetailDeliveryInfo {

    DateTime: Date;
    Address: string;
    FullName: string;
    PhoneNumber: string;

    constructor() {
        this.DateTime = new Date();
    }

    static DeepCopy(source: OrderDetailDeliveryInfo): OrderDetailDeliveryInfo {

        const dest = new OrderDetailDeliveryInfo();

        dest.Address = source.Address;
        dest.FullName = source.FullName;
        dest.PhoneNumber = source.PhoneNumber;

        dest.DateTime.setFullYear(source.DateTime.getFullYear());
        dest.DateTime.setMonth(source.DateTime.getMonth());
        dest.DateTime.setDate(source.DateTime.getDate());
        dest.DateTime.setHours(source.DateTime.getHours());
        dest.DateTime.setMinutes(source.DateTime.getMinutes());
        dest.DateTime.setSeconds(0);

        return dest;
    }
}

export class OrderCustomerInfoViewModel {

    Name: string;
    Id: string;

    DiscountPercent = 0;
    ScoreUsed = 0; // điểm KH muốn sử dụng cho hoá đơn này
    GainedScore = 0; // điểm kiếm được từ hoá đơn
    ReceiverInfos: CustomerReceiverDetail[];
    SpecialDays: SpecialDay[];
    AvailableScore = 0;
    PhoneNumber: string;
    MembershipType: MembershipTypes;
    Address: string;
    AccumulatedAmount: number;
    CustomerScoreUsedTotal: number;

    constructor() {
        this.ReceiverInfos = [];
        this.SpecialDays = [];
    }

    static toViewModel(customer: Customer, vm: OrderCustomerInfoViewModel = null): OrderCustomerInfoViewModel {

        if (!vm || vm == null)
            vm = new OrderCustomerInfoViewModel();

        console.log(customer.ReceiverInfos);

        vm.Id = customer.Id;
        vm.Name = customer.FullName;
        vm.PhoneNumber = customer.PhoneNumber;
        vm.MembershipType = customer.MembershipInfo.MembershipType;
        vm.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
        vm.AvailableScore = customer.MembershipInfo.AvailableScore;
        vm.AccumulatedAmount = customer.MembershipInfo.AccumulatedAmount;
        vm.Address = customer.Address.Home ? customer.Address.Home : customer.Address.Work ? customer.Address.Work : '';
        vm.CustomerScoreUsedTotal = customer.MembershipInfo.UsedScoreTotal;

        Object.assign(vm.ReceiverInfos, customer.ReceiverInfos);
        Object.assign(vm.SpecialDays, customer.SpecialDays);


        console.info(vm);

        return vm;
    }
}