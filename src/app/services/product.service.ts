import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { promise } from 'protractor';
import { Product } from '../models/entities/product.entity';
import { async } from '@angular/core/testing';
import { constants } from 'crypto';
import { GlobalService } from './common/global.service';
import { ProductImage } from '../models/entities/file.entity';
import { StorageService } from './storage.service';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';
import { Category } from '../models/entities/category.entity';
import { Tag } from '../models/entities/tag.entity';

@Injectable({
    providedIn: 'root'
})
export class ProductService {


    constructor(private htttService: HttpService, private globalService: GlobalService) {
    }

    deleteProduct(id: number, prodImg: string): Promise<any> {
        return this.htttService.post(API_END_POINT.deleteProduct, {
            productImg: prodImg,
            productId: id
        }).then(() => {
            return;
        }).catch(err => {
            this.htttService.handleError(err);
        });
    }

    deleteManyProducts(ids: number[], prodImages: string[]): Promise<any> {

        return this.htttService.post(API_END_POINT.deleteManyProduct, {
            productIds: ids,
            productImgNames: prodImages
        }).then(res => {
            return;
        }).catch(err => {
            this.htttService.handleError(err);
        });
    }


    validateProductPrices(product: Product): Product {

        if (!product.PriceList || product.PriceList.length < 1) {
            product.PriceList = [product.Price && product.Price > 0 ? product.Price : 0];
        }

        if (!product.Price || product.Price <= 0)
            product.Price = product.PriceList[0];

        if (product.PriceList.indexOf(product.Price) < 0) {
            product.PriceList.push(product.Price);
            console.log(product.Price, product.PriceList);
        }

        product.PriceList = product.PriceList.filter((item, pos, self) => self.indexOf(item) == pos);

        return product;
    }

    insertListWithOneCate(categoryId: number, products: Product[]): Promise<any> {
        return this.htttService.post(API_END_POINT.addBulkOneCate, {
            products: products,
            categoryId: categoryId
        }).then(res => {
            return;
        }).catch(err => {
            this.htttService.handleError(err);
            throw err;
        })
    }

    updateProduct(product: Product, categoryIds: number[] = [], tagIds: number[] = [], productImg: File): Promise<any> {

        product = this.validateProductPrices(product);

        console.log(product);

        let par = {
            categoryIds: JSON.stringify(categoryIds),
            tagIds: JSON.stringify(tagIds),
            description: product.Description,
            price: product.Price,
            name: product.Name,
            productImg: productImg,
            id: product.Id,
            oldProductImg: product.ImageUrl,
            priceList: JSON.stringify(product.PriceList)
        }

        return this.htttService.postForm(API_END_POINT.updateProduct, par).then(data => {

            this.globalService.stopLoading();
            return data;

        }).catch(err => {
            this.htttService.handleError(err);
        })

    }

    createProduct(product: Product, categoryIds: number[] = [], tagIds: number[] = [], productImg: File): Promise<any> {

        product = this.validateProductPrices(product);

        let par = {
            categoryIds: JSON.stringify(categoryIds),
            tagIds: JSON.stringify(tagIds),
            description: product.Description,
            price: product.Price,
            name: product.Name,
            productImg: productImg,
            priceList: JSON.stringify(product.PriceList)
        }

        return this.htttService.postForm(API_END_POINT.createProduct, par).then(data => {

            this.globalService.stopLoading();
            return data;

        }).catch(err => {
            this.htttService.handleError(err);
        });
    }

    getProductsFromRaw(items: any): {
        Product: Product,
        Tags: Tag[],
        Categories: Category[]
    }[] {

        let products: {
            Product: Product,
            Tags: Tag[],
            Categories: Category[]
        }[] = [];

        items.forEach(item => {

            let product = new Product();

            product.Id = item.Id;
            product.Name = item.Name;
            product.Price = item.Price;
            product.ImageUrl = item.ImageUrl;
            product.PriceList = item.PriceList ? JSON.parse(item.PriceList) : [];
            product.Description = item.Description;

            let tags: Tag[] = [];
            item.tags.forEach(rawTag => {

                let tag = new Tag();
                tag.Name = rawTag.Name;
                tag.Description = rawTag.Description;
                tag.Alias = rawTag.Alias;
                tag.Id = rawTag.Id;

                tags.push(tag);
            });

            let categories: Category[] = [];
            item.categories.forEach(rawCategory => {
                let category = new Category();
                category.Id = rawCategory.Id;
                category.Description = rawCategory.Description;
                category.Name = rawCategory.Name;

                categories.push(category);
            });

            products.push({
                Product: product,
                Tags: tags,
                Categories: categories
            })

        });

        return products;

    }

    getAll(): Promise<{
        Product: Product,
        Tags: Tag[],
        Categories: Category[]
    }[]> {
        return this.htttService.post(API_END_POINT.getAllProducts)
            .then(data => {
                return this.getProductsFromRaw(data.products);
            });
    }

    get(path: string, obj: any): Promise<{
        products: {
            Product: Product,
            Tags: Tag[],
            Categories: Category[]
        }[],
        totalItemCount: number,
        totalPages: number
    }> {
        return this.htttService.post(path, obj).then(data => {

            if (!data) {
                return null;
            }

            let res: {
                products: {
                    Product: Product,
                    Tags: Tag[],
                    Categories: Category[]
                }[],
                totalItemCount: number,
                totalPages: number
            } = {
                totalItemCount: 0,
                totalPages: 0,
                products: []
            };

            if (!data.items) {
                return null;
            }

            res.totalItemCount = data.totalItemCount;
            res.totalPages = data.totalPages;
            res.products = this.getProductsFromRaw(data.items);

            return res;

        }).catch(err => {
            this.htttService.handleError(err);
            throw err;
        })
    }

    getRecords(page: number, itemsPerPage: number, categoryId: number, tagIds: number[] = [], name: string = ''): Promise<{
        products: {
            Product: Product,
            Tags: Tag[],
            Categories: Category[]
        }[],
        totalItemCount: number,
        totalPages: number
    }> {

        return this.get(API_END_POINT.getProducts, {
            page: page - 1,
            size: itemsPerPage,
            name: name,
            categoryId: categoryId,
            tagIds: tagIds
        });
    }

    getRecordsByPrice(page: number, itemsPerPage: number, categoryId: number, price: number): Promise<{
        products: {
            Product: Product,
            Tags: Tag[],
            Categories: Category[]
        }[],
        totalItemCount: number,
        totalPages: number
    }> {

        return this.get(API_END_POINT.getProductsByPrice, {
            page: page - 1,
            size: itemsPerPage,
            price: price,
            categoryId: categoryId,
        });
    }

}
