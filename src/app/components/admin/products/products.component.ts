import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { MenuItems, ProductSearchingMode } from 'src/app/models/enums';
import { NgForm } from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/entities/tag.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { ProductImageService } from 'src/app/services/product.image.service';
import { ProductTagViewModel } from 'src/app/models/view.models/product.tag.model';
import { Category } from 'src/app/models/entities/category.entity';
import { CategoryService } from 'src/app/services/category.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

declare function showProductSetupPopup();
declare function hideAdd();

export class PriceItem {
  Price: number;
  Index: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Danh sách sản phẩm', MenuItems.Product);

  pageCount = 0;
  itemTotalCount = 0;
  currentPage = 0;
  searchTerm = '';

  newTagName = "";
  edittingFile: any;
  edittingImageUrl: any;
  isSelectAll = false;
  edittingProduct: Product;
  priceSearchTerm = 0;
  productSearchingMode: ProductSearchingMode;
  priceList: PriceItem[];

  _selectedCategory: number = 0;
  get selectedCategory(): number {
    return this._selectedCategory;
  }
  set selectedCategory(val: number) {

    this._selectedCategory = val;
    this.searchTerm = '';
    this.priceSearchTerm = 0;
    this.productSearchingMode = ProductSearchingMode.Name;

    this.categoryChange();
  }

  _itemsPerPage: number;
  get itemPerpage(): number {
    return this._itemsPerPage;
  }
  set itemPerpage(val: number) {
    this._itemsPerPage = val;
    this.pageChanged(1);
  }

  globalCategories: {
    Category: Category,
    IsSelected: boolean
  }[];

  globalTags: {
    Tag: Tag,
    IsSelected: boolean
  }[];

  products: {
    Product: Product,
    IsSelect: boolean,
    Categories: Category[],
    Tags: Tag[]
  }[];

  constructor(private productService: ProductService, private tagService: TagService, private categoryService: CategoryService) {
    super();

    this.edittingProduct = new Product();
    this.products = [];
    this._itemsPerPage = 10;
    this.globalCategories = [];
    this.globalTags = [];
    this.productSearchingMode = ProductSearchingMode.None;
    this.priceList = [];

  }

  protected Init() {

    this.products = [];
    this.itemTotalCount = 0;
    this.pageCount = 0;

    this.categoryService.getAll()
      .then(categories => {
        categories.forEach(category => {
          this.globalCategories.push({
            Category: category,
            IsSelected: false
          });
        })
      });

    this.tagService.getAll()
      .then(tags => {
        tags.forEach(tag => {
          this.globalTags.push({
            Tag: tag,
            IsSelected: false
          });
        })
      });

    this.pageChanged(1);
  }

  unselectCategory(category: Category) {
    this.globalCategories.forEach(cate => {
      if (category.Id == cate.Category.Id) {
        cate.IsSelected = false;
      }
    });
  }

  selectCategory(category: Category) {
    this.globalCategories.forEach(cate => {
      if (category.Id == cate.Category.Id) {
        cate.IsSelected = true;
      }
    });
  }



  categoryChange() {
    this.searchTerm = '';
    this.products = [];
    this.pageChanged(1);
  }

  editProduct() {

    let categoryIds: number[] = [];
    this.globalCategories.forEach(category => {
      if (category.IsSelected)
        categoryIds.push(category.Category.Id);
    });

    let tagIds: number[] = [];
    this.globalTags.forEach(tag => {
      if (tag.IsSelected)
        tagIds.push(tag.Tag.Id);
    });

    this.edittingProduct.PriceList = [];

    this.priceList.forEach(priceItem => {
      if (priceItem.Price > 0) {
        this.edittingProduct.PriceList.push(+priceItem.Price);
      }
    });


    this.productService.updateProduct(this.edittingProduct, categoryIds, tagIds, this.edittingFile)
      .then(res => {
        hideAdd();
        this.pageChanged(this.currentPage);
      });

  }

  addProduct(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (this.edittingProduct.Id) {
      this.editProduct();
      return
    }

    let categoryIds: number[] = [];
    this.globalCategories.forEach(category => {
      if (category.IsSelected)
        categoryIds.push(category.Category.Id);
    });

    let tagIds: number[] = [];
    this.globalTags.forEach(tag => {
      if (tag.IsSelected)
        tagIds.push(tag.Tag.Id);
    });

    this.edittingProduct.PriceList = [];

    this.priceList.forEach(priceItem => {
      if (priceItem.Price > 0) {
        this.edittingProduct.PriceList.push(+priceItem.Price);
      }
    });

    this.productService.createProduct(this.edittingProduct, categoryIds, tagIds, this.edittingFile)
      .then(res => {
        this.pageChanged(this.currentPage);
        hideAdd();
      });

  }

  addPrice() {
    this.priceList.push({ Price: 0, Index: this.priceList.length });
  }

  subPriceItem(index: number) {
    this.priceList.splice(index, 1);
  }

  deleteProduct(id: number) {
    this.openConfirm('Chắc chắn xoá sản phẩm này ? ', () => {
      let product = this.products.filter(p => p.Product.Id == id)[0].Product;
      if (product) {
        this.productService.deleteProduct(product.Id, product.ImageUrl)
          .then(() => {
            this.pageChanged(this.currentPage);
          });
      }
    });
  }

  async pageChanged(page: number) {

    this.products = [];
    this.currentPage = page;

    if (page <= 0) {
      return;
    }


    let prods: any;

    if (this.productSearchingMode != ProductSearchingMode.Price) {
      prods = await this.productService.getRecords(page, this.itemPerpage, this._selectedCategory, [], this.searchTerm)
    } else {
      prods = await this.productService.getRecordsByPrice(page, this.itemPerpage, this._selectedCategory, this.priceSearchTerm);
    }

    if (prods == null)
      return;

    this.itemTotalCount = prods.totalItemCount;
    this.pageCount = prods.totalPages;

    prods.products.forEach(rawProduct => {
      this.products.push({
        Product: rawProduct.Product,
        Categories: rawProduct.Categories,
        IsSelect: false,
        Tags: rawProduct.Tags
      });

    });

  }

  unselectTag(removingTag: Tag) {

    this.globalTags.forEach(tag => {
      if (removingTag.Id == tag.Tag.Id) {
        tag.IsSelected = false;
      }
    });

  }

  selectTag(removingTag: Tag) {

    this.globalTags.forEach(tag => {
      if (removingTag.Id == tag.Tag.Id) {
        tag.IsSelected = true;
      }
    });

  }

  onChange(event) {
    const filesUpload: File = event.target.files[0];

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    this.edittingFile = filesUpload;

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {
      this.edittingImageUrl = reader.result.toString();
    }

  }

  resetData() {

    this.edittingProduct = new Product();

    this.globalCategories.forEach(category => {
      category.IsSelected = false;
    });

    this.globalTags.forEach(tag => {
      tag.IsSelected = false;
    });

    this.edittingImageUrl = '';
    this.edittingFile = null;
    this.priceList = [];
  }


  addingRequest() {

    this.resetData();
    showProductSetupPopup();
  }

  selectProductToEdit(id: number) {

    this.resetData();

    let product = this.products.filter(p => p.Product.Id == id)[0];
    this.edittingProduct = product.Product;
    this.edittingFile = null;
    this.edittingImageUrl = this.edittingProduct.ImageUrl;

    console.log(this.edittingProduct);

    this.globalCategories.forEach(category => {
      let contain = product.Categories.filter(p => p.Id == category.Category.Id);
      if (contain && contain.length > 0) {
        category.IsSelected = true;
      }
      else {
        category.IsSelected = false;
      }
    });

    this.globalTags.forEach(tag => {
      let contain = product.Tags.filter(p => p.Id == tag.Tag.Id);
      if (contain && contain.length > 0) {
        tag.IsSelected = true;
      }
      else {
        tag.IsSelected = false;
      }
    });

    this.edittingProduct.PriceList.forEach(price => {
      this.priceList.push({ Price: price, Index: this.priceList.length });
    });

    showProductSetupPopup();
  }

  addTag() {

    const alias = ExchangeService.getAlias(this.newTagName);

    var tag = new Tag();
    tag.Alias = alias;
    tag.Description = "tag moi";
    tag.Name = this.newTagName;

    this.tagService.createTag(tag)
      .then((newTag) => {
        if (newTag) {
          this.newTagName = '';
          this.globalTags.push({
            Tag: newTag,
            IsSelected: true
          });
        }
      })
      .catch(() => {

      });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.products.forEach(product => {
      product.IsSelect = isCheck;
    });
  }

  deleteMany() {
    this.openConfirm('Chắc chắn xoá các sản phẩm này?', () => {
      let ids = [];
      let prodImages = [];

      this.products.forEach(product => {
        if (product.IsSelect) {

          ids.push(product.Product.Id);
          if (product.Product.ImageUrl)
            prodImages.push(product.Product.ImageUrl);

        }
      });

      this.productService.deleteManyProducts(ids, prodImages)
        .then(() => {
          this.pageChanged(this.currentPage);
        });

    });
  }


  searchProduct(term) {

    if (term.indexOf('k') == term.length - 1 || term.indexOf('K') == term.length - 1) {

      let newTerm = term.toLowerCase().split('k')[0];

      var price = parseInt(newTerm);

      console.log(price);

      if (price != NaN && price > 0) {

        this.productSearchingMode = ProductSearchingMode.Price;
        this.priceSearchTerm = price * 1000;
        this.searchTerm = '';

      } else {

        this.productSearchingMode = ProductSearchingMode.Name;
        this.searchTerm = '';
        this.priceSearchTerm = 0;

      }

    }
    else {

      this.productSearchingMode = ProductSearchingMode.Name;
      this.priceSearchTerm = 0;
      this.searchTerm = term;

    }

    this.pageChanged(1);

  }
}
