import { BaseEntity } from './base.entity';

export class District extends BaseEntity {
    Name: string;
}

export class Ward extends BaseEntity {
    Name: string;
    DistrictId: string;
}