import { BaseEntity } from './base.entity';

export class District {
    Id: string;
    Name: string;
}

export class Ward {
    Id: string;
    Name: string;
    DistrictId: string;
}