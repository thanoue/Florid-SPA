import { emit } from 'process';

export enum EntityType {
    User,
    Product,
    Customer,
    Order,
}


export enum Roles {
    User = 'User',
    Admin = 'Admin',
    Florist = 'Florist',
    Account = 'Account',
    Shipper = 'Shipper'
};

export enum MembershipTypes {
    NewCustomer = 'NewCustomer',
    Member = 'Member',
    Vip = 'Vip',
    VVip = 'VVip'
}

export enum CusContactInfoTypes {
    Zalo = 'Zalo',
    Viber = 'Viber',
    Facebook = 'Facebook',
    Skype = 'Skype',
    Instagram = 'Instagram'
}


export enum MenuItems {
    None,
    Home,
    User,
    Customer,
    Product,
    ProductCategory,
    ProductTag,
    Order,
    Summary
}

export enum OrderDetailStates {
    Added = 'Added',
    Waiting = 'Waiting',
    Making = 'Making',
    Comfirming = 'Comfirming',
    DeliveryWaiting = 'DeliveryWaiting',
    Delivering = 'Delivering',
    Deliveried = 'Deliveried',
    Completed = 'Completed',
    Canceled = 'Canceled'
}

export enum Sexes {
    Male = 'Male',
    Female = 'Female',
    Others = 'Others'
}

export enum AlertType {
    Info = 0,
    Error,
    Success,
    Warning
}
