import { BaseEntity } from './base.entity';
import { MembershipTypes, Sexes, CusContactInfoTypes } from '../enums';
import { CustomerReceiverDetail } from './order.entity';

export class Customer extends BaseEntity {
    
    FullName: string;
    PhoneNumber: string;
    Birthday: number;
    SpecialDays: SpecialDay[];
    ContactInfo: CustomerContactInfo;
    Address: CustomerAddress;
    MembershipInfo: MembershipInfo;
    ReceiverInfos: CustomerReceiverDetail[];
    Index = 0;
    Sex: Sexes = Sexes.Male;
    MainContactInfo: CusContactInfoTypes;

   
    constructor() {
        super();
        this.ContactInfo = new CustomerContactInfo();
        this.Address = new CustomerAddress();
        this.MembershipInfo = new MembershipInfo();
        this.FullName = '';
        this.PhoneNumber = '';
        this.SpecialDays = [];
        this.ReceiverInfos = [];
        this.MainContactInfo = CusContactInfoTypes.Zalo;
    }
}

export class SpecialDay {
    Date: number;
    Description: string;
}

export class MembershipInfo {
    UsedScoreTotal = 0;
    AvailableScore = 0;
    AccumulatedAmount = 0;
    MembershipType: MembershipTypes = MembershipTypes.NewCustomer;
}


export class CustomerContactInfo {
    Zalo = '';
    Viber = '';
    Facebook: string;
    Instagram = '';
    Skype = '';
}

export class CustomerAddress {
    Home = '';
    Work = '';
}

