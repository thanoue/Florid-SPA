import { OrderDetailStates, OrderType } from '../../models/enums';
import { MembershipTypes } from '../enums';
import { Customer, SpecialDay } from '../entities/customer.entity';
import { ExchangeService } from '../../services/common/exchange.service';
import { CustomerReceiverDetail, OrderDetail, Order, ODSeenUserInfo, Making, Shipping } from '../entities/order.entity';
import { Purchase } from './purchase.entity';
import { User } from '../entities/user.entity';
import { from } from 'rxjs';

export class OrderViewModel {

    OrderId: string;
    TotalAmount: number;
    TotalPaidAmount: number;
    CreatedDate: Date;
    VATIncluded = false;
    OrderType: OrderType;
    DoneTime: number;
    Index: number;

    IsMemberDiscountApply: boolean;

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

    IsVATIncluded = false;
    Description = '';

    CustomerName = '';
    CustomerPhoneNumber = '';

    IsFromHardCodeProduct = false;
    HardcodeImageName = '';

    Makings: Making[];
    Shippings: Shipping[];

    Shippers: User[];
    Florists: User[];

    PercentDiscount: number;
    AmountDiscount: number;

    MakingRequestTime: number;

    MakingNote: string;
    ShippingNote: string;

    NoteImages: string[];
    SeenUsers: ODSeenUserInfo[];

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
        this.Makings = [];
        this.Shippings = []
        this.SeenUsers = [];
        this.NoteImages = [];
        this.Shippers = [];
        this.Florists = [];
    }

    static DeepCopy(model: OrderDetailViewModel) {

        const viewModel = new OrderDetailViewModel();

        viewModel.MakingNote = model.MakingNote;
        viewModel.MakingRequestTime = model.MakingRequestTime;
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
        viewModel.PurposeOf = model.PurposeOf;
        viewModel.PercentDiscount = model.PercentDiscount;
        viewModel.AmountDiscount = model.AmountDiscount;
        viewModel.ShippingNote = model.ShippingNote;

        if (model.NoteImages) {
            Object.assign(viewModel.NoteImages, model.NoteImages);
        }

        if (model.SeenUsers && model.SeenUsers.length > 0) {
            model.SeenUsers.forEach(user => {
                viewModel.SeenUsers.push(ODSeenUserInfo.DeepCopy(user));
            });
        }

        if (model.Shippings) {
            Object.assign(viewModel.Shippings, model.Shippings);
        }

        if (model.MakingNote) {
            Object.assign(viewModel.MakingNote, model.MakingNote);
        }

        if (model.Shippers) {
            Object.assign(viewModel.Shippers, model.Shippers);
        }

        if (model.Florists) {
            Object.assign(viewModel.Florists, model.Florists);
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

        let time = source.DateTime.getTime();
        dest.DateTime = new Date(time);

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

        if (!vm || vm == null){
            vm = new OrderCustomerInfoViewModel();
        }

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

        return vm;
    }
}
