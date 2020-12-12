export class Product {
    Id: number;
    Name: string;
    Price: number;
    ImageUrl: string;
    Page: number;
    Unit: string;
    Index: number;
    CategoryIndex: number;
    PriceList: number[];

    Description: string;

    constructor() {
        this.Description = '';
        this.PriceList = [];
    }

}
