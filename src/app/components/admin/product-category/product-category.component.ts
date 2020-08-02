import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { Category } from 'src/app/models/entities/category.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { CategoryService } from 'src/app/services/category.service';
import { NgForm } from '@angular/forms';

declare function hideAdd(): any;
declare function showCategoryEditPopup(): any;

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Danh mục sản phẩm', MenuItems.ProductCategory);


  isSelectAll: boolean = false;
  currentPage = 1;

  CategoryAlias = '';

  currentCategory: Category;

  Categories: {
    Category: Category,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {

    this._itemsPerPage = val;

    this.pageChanged(1);
  }

  constructor(private categoryService: CategoryService) {
    super();
    this.currentCategory = new Category();
  }

  addRequest() {
    this.currentCategory = new Category();
    showCategoryEditPopup();
  }


  editRequest(category: Category) {

    this.currentCategory = new Category();

    this.currentCategory.Id = category.Id;
    this.currentCategory.Description = category.Description;
    this.currentCategory.Name = category.Name;

    showCategoryEditPopup();
  }

  addCategory(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.currentCategory.Id || this.currentCategory.Id <= 0) {
      this.categoryService.createCategory(this.currentCategory).then(res => {
        hideAdd();
        this.currentCategory = new Category();
        this.pageChanged(this.currentPage);
      });
    } else {
      this.categoryService.updateCategory(this.currentCategory).then(res => {
        hideAdd();
        this.currentCategory = new Category();
        this.pageChanged(this.currentPage);
      });
    }
  }

  protected Init() {
    this._itemsPerPage = 10;
    this.pageChanged(1);
  }

  pageChanged(page: number) {

    this.currentPage = page;

    this.categoryService.getRecords(page, this._itemsPerPage).then(categories => {

      this.Categories = [];
      this.itemTotalCount = categories.totalItemCount;
      this.pageCount = categories.totalPages;

      categories.categories.forEach(Category => {
        this.Categories.push({
          Category: Category,
          IsChecked: false
        });
      })
    });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.Categories.forEach(Category => {
      Category.IsChecked = isCheck;
    });
  }

  deleteCategories() {

    let categoryIds: number[] = [];

    this.Categories.forEach(category => {
      if (category.IsChecked) {
        categoryIds.push(category.Category.Id);
      }
    });

    if (categoryIds.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá các danh mục sản phẩm?', () => {
      this.categoryService.deleteCategorys(categoryIds).then(re => {

        this.pageChanged(this.currentPage);

      });
    });
  }

  deleteCategory(category: Category) {

    this.openConfirm('Chắc chắn xoá danh mục sản phẩm?', () => {

      this.categoryService.deleteCategory(category.Id).then(re => {

        this.pageChanged(this.currentPage);

      });

    });

  }


}
