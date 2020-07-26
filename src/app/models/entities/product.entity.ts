import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';
import { ProductTagViewModel } from '../view.models/product.tag.model';

export class Product {
    Id: number;
    Name: string;
    Price: string;
    ImageUrl: string;
    Page: number;
    Index: number;
    CategoryIndex: number;

    Description: string;

    constructor() {
        this.Description = '';
    }

}
