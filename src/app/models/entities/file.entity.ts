import { BaseEntity } from './base.entity';
export class BaseFile extends BaseEntity {
    Name: string;
    Url: string;
    FolderName: string;
}

export class Receipt extends BaseFile {
    OrderId: string;
    CustomerId: string;
    constructor() {
        super();
        this.FolderName = '/receipts';
    }
}

export class ProductImage extends BaseFile {
    constructor() {
        super();
        this.FolderName = '/products';
    }
}

export class TempProduct extends BaseFile {
    constructor() {
        super();
        this.FolderName = '/tempProduct';
    }
}

export class ResultImage extends BaseFile {
    constructor() {
        super();
        this.FolderName = '/resultImages';
    }
}

export class DeliveryImage extends BaseFile {
    constructor() {
        super();
        this.FolderName = '/deliveryImages';
    }
}

export class UserAvtImage extends BaseFile {
    constructor() {
        super();
        this.FolderName = '/userAvtImg';
    }
}
