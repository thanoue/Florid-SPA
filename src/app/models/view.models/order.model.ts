import { OrderDetailStates } from '../../models/enums';
import { MembershipTypes } from '../enums';
import { Customer } from '../entities/customer.entity';
import { ExchangeService } from '../../services/exchange.service';
import { CustomerReceiverDetail, OrderDetail, Order, ODFloristInfo, ODShipperInfo, ODSeenUserInfo } from '../entities/order.entity';
import { sha1 } from '@angular/compiler/src/i18n/digest';

export class OrderViewModel {

    OrderId: string;
    TotalAmount: number;
    TotalPaidAmount: number;
    CreatedDate: Date;
    VATIncluded = false;
    Index: number;

    CustomerInfo: OrderCustomerInfoViewModel;

    OrderDetails: OrderDetailViewModel[];


    static ToViewModel(entity: Order, customer: Customer): OrderViewModel {

        const vm = new OrderViewModel();

        vm.OrderId = entity.Id;
        vm.TotalAmount = entity.TotalAmount;
        vm.TotalPaidAmount = entity.TotalPaidAmount;
        vm.VATIncluded = entity.VATIncluded;
        vm.CreatedDate = new Date(entity.Created);
        vm.Index = entity.Index;

        vm.CustomerInfo.ScoreUsed = entity.ScoreUsed;
        vm.CustomerInfo.GainedScore = entity.GainedScore;
        vm.CustomerInfo.Id = entity.CustomerId;
        vm.CustomerInfo.MembershipType = customer.MembershipInfo.MembershipType;
        vm.CustomerInfo.DiscountPercent = ExchangeService.getMemberDiscountPercent(vm.CustomerInfo.MembershipType);
        vm.CustomerInfo.Name = customer.FullName;
        vm.CustomerInfo.PhoneNumber = customer.PhoneNumber;
        vm.CustomerInfo.AvailableScore = customer.MembershipInfo.AvailableScore;
        Object.assign(vm.CustomerInfo.ReceiverInfos, customer.ReceiverInfos);// customer.ReceiverInfos;

        return vm;
    }

    constructor() {
        this.OrderDetails = [];
        this.CustomerInfo = new OrderCustomerInfoViewModel();
        this.TotalAmount = 0;
        this.TotalPaidAmount = 0;
        this.OrderId = '';
    }
}

export class OrderDetailViewModel {

    ProductName = '';
    OrderDetailId = '';
    OrderId = '';
    OrderIndex = 0;
    State = OrderDetailStates.Waiting;
    ProductId = '';
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

    SeenUsers: ODSeenUserInfo[];

    constructor() {
        this.DeliveryInfo = new OrderDetailDeliveryInfo();
        this.FloristInfo = new ODFloristInfo();
        this.ShipperInfo = new ODShipperInfo();
        this.SeenUsers = [];
    }

    static ToViewModel(entity: OrderDetail) {
        const vm = new OrderDetailViewModel();

        vm.CustomerName = entity.CustomerName;
        vm.CustomerPhoneNumber = entity.CustomerPhoneNumber;
        vm.IsVATIncluded = entity.IsVATIncluded;
        vm.OrderDetailId = entity.Id;
        vm.OrderId = entity.OrderId;
        vm.AdditionalFee = entity.AdditionalFee;
        vm.Description = entity.Description;
        vm.Index = entity.Index;

        vm.MakingSortOrder = entity.MakingSortOrder;
        vm.ShippingSortOrder = entity.ShippingSortOrder;

        vm.ModifiedPrice = entity.ProductModifiedPrice;
        vm.ProductId = entity.Id;
        vm.OriginalPrice = entity.ProductPrice;
        vm.ProductImageUrl = entity.ProductImageUrl;
        vm.ProductName = entity.ProductName;

        vm.IsFromHardCodeProduct = entity.IsHardcodeProduct;
        vm.HardcodeImageName = entity.HardcodeProductImageName;

        vm.PurposeOf = entity.PurposeOf;

        vm.DeliveryInfo.DateTime = new Date(entity.DeliveryInfo.ReceivingTime);
        vm.DeliveryInfo.Address = entity.DeliveryInfo.ReceiverDetail.Address;
        vm.DeliveryInfo.FullName = entity.DeliveryInfo.ReceiverDetail.FullName;
        vm.DeliveryInfo.PhoneNumber = entity.DeliveryInfo.ReceiverDetail.PhoneNumber;

        vm.ResultImageUrl = entity.ResultImageUrl;
        vm.DeliveryImageUrl = entity.DeliveryImageUrl;

        vm.State = entity.State;
        vm.Quantity = 1;

        if (entity.SeenUsers && entity.SeenUsers.length > 0) {
            entity.SeenUsers.forEach(user => {
                vm.SeenUsers.push(ODSeenUserInfo.DeepCopy(user));
            });
        }

        if (entity.FloristInfo) {
            vm.FloristInfo.Id = entity.FloristInfo.Id;
            vm.FloristInfo.AssignTime = entity.FloristInfo.AssignTime;
            vm.FloristInfo.CompletedTime = entity.FloristInfo.CompletedTime;
            vm.FloristInfo.FullName = entity.FloristInfo.FullName;
        }

        if (entity.ShipperInfo) {
            vm.ShipperInfo.Id = entity.ShipperInfo.Id;
            vm.ShipperInfo.AssignTime = entity.ShipperInfo.AssignTime;
            vm.ShipperInfo.CompletedTime = entity.ShipperInfo.CompletedTime;
            vm.ShipperInfo.FullName = entity.ShipperInfo.FullName;
        }

        return vm;
    }

    static DeepCopy(model: OrderDetailViewModel) {

        const viewModel = new OrderDetailViewModel();

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
    AvailableScore = 0;
    PhoneNumber: string;
    MembershipType: MembershipTypes;

    constructor() {
        this.ReceiverInfos = [];
    }

    static toViewModel(customer: Customer): OrderCustomerInfoViewModel {
        const viewModel = new OrderCustomerInfoViewModel();

        viewModel.Id = customer.Id;
        viewModel.Name = customer.FullName;
        viewModel.PhoneNumber = customer.PhoneNumber;
        viewModel.MembershipType = customer.MembershipInfo.MembershipType;
        viewModel.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
        viewModel.AvailableScore = customer.MembershipInfo.AvailableScore;
        Object.assign(viewModel.ReceiverInfos, customer.ReceiverInfos);

        return viewModel;
    }
}