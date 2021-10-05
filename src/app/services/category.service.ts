import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Category } from '../models/entities/category.entity';
import { GlobalService } from './common/global.service';
import { StorageService } from './storage.service';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private htttpService: HttpService, private globalService: GlobalService) {
  }

  createCategory(category: Category): Promise<any> {

    return this.htttpService.post(API_END_POINT.createCategory, {
      name: category.Name,
      description: category.Description
    }).then((res) => {

      return res;

    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }

  updateCategory(category: Category): Promise<any> {

    return this.htttpService.post(API_END_POINT.updateCategory, {
      name: category.Name,
      description: category.Description,
      id: category.Id
    }).then((res) => {

      return res;

    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }


  deleteCategory(id: number): Promise<any> {

    return this.htttpService.post(API_END_POINT.deleteCategory, {
      id
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }

  deleteCategorys(ids: number[]): Promise<any> {

    return this.htttpService.post(API_END_POINT.deleteCategories, {
      categoryIds: ids
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }

  getAll(): Promise<Category[]> {
    return this.htttpService.get(API_END_POINT.getAllCategories, false)
      .then(datas => {

        const categories: Category[] = [];

        datas.forEach(rawCategory => {

          const category = new Category();

          category.Id = rawCategory.Id;
          category.Description = rawCategory.Description;
          category.Name = rawCategory.Name;

          categories.push(category);

        });

        return categories;
      })
      .catch(err => {
        this.htttpService.handleError(err);
        throw err;
      });
  }

  getRecords(page: number, itemsPerPage: number, descriptionTerm: string = ''): Promise<{
    categories: Category[],
    totalItemCount: number,
    totalPages: number
  }> {
    return this.htttpService.get(API_END_POINT.getCategories, {
      page: page - 1,
      size: itemsPerPage,
      description: descriptionTerm
    }).then(datas => {

      if (!datas) {
        return null;
      }

      const res: any = {};

      res.totalItemCount = +datas.totalItemCount;
      res.totalPages = +datas.totalPages;
      res.categories = [];

      if (datas.items) {

        datas.items.forEach(item => {
          res.categories.push(item);
        });

      }

      return res;

    }).catch(err => {
      this.htttpService.handleError(err);
      throw err;
    });

  }

}
