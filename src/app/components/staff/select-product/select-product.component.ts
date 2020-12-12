import { Component, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductSearchingMode } from 'src/app/models/enums';
import { MyCurrPipe } from 'src/app/pipes/date.pipe';
import { ImgPipe } from 'src/app/pipes/img.pipe';
import { ImgType } from 'src/app/app.constants';

declare function selectProductCategory(menuitems: { Name: string; Value: number; }[], callback: (index: any) => void): any;
declare function filterFocus(): any;
declare function viewProductImg(url: string, onCancel: () => void): any;

@Component({
  selector: 'app-search-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.css'],
})
export class SelectProductComponent extends BaseComponent {

  Title = 'Chọn sản phẩm';
  productCategory: number;
  currentPage = 1;
  itemsPerPage = 18;
  currentMaxPage = 1;
  images: string[];
  pagingProducts: Product[];
  categoryName = '';
  selectedProduct: Product;
  currentHardcodeUsedCount = -1;
  searchTerm = '';
  priceSearchTerm = 0;
  productSearchingMode: ProductSearchingMode;

  categories: {
    Value: number,
    Name: string
  }[];

  globalTags: {
    Tag: Tag,
    IsSelected: boolean
  }[];


  viewProdOptions = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowDrag: true,
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: true,
      prev: true
    }
  };

  protected IsDataLosingWarning = false;

  constructor(private route: ActivatedRoute, private router: Router, private orderDetailService: OrderDetailService,
    // tslint:disable-next-line: align
    private productService: ProductService, private _ngZone: NgZone, private tempProductService: TempProductService,
    // tslint:disable-next-line: align
    private tagService: TagService,
    private categoryService: CategoryService) {

    super();

    this.pagingProducts = [];
    this.categories = [];
    this.globalTags = [];
    this.productSearchingMode = ProductSearchingMode.None;
    this.images = [];
  }

  protected async Init() {

    this.selectedProduct = new Product();

    this.route.queryParams
      .subscribe(params => {

        this.categoryService.getAll()
          .then((cates) => {

            this.categories.push({
              Value: -1,
              Name: 'Tất cả'
            });

            cates.forEach(cate => {
              this.categories.push({
                Value: cate.Id,
                Name: cate.Name
              });
            });

            this.tagService.getAll().then(tags => {

              tags.forEach(tag => {

                this.globalTags.push({
                  Tag: tag,
                  IsSelected: false
                });

              });

              this.getProductByCategory(+params.category);

            });

          });
      });

    const key = 'searchProdReference';

    window[key] = {
      component: this, zone: this._ngZone,
      itemSelected: (data) => this.setSelectedProduct(data),
      tagsSelected: () => this.tagsSelected()
    };

  }

  tagsSelected() {

    let tags: number[] = [];

    this.globalTags.forEach(tag => {

      if (tag.IsSelected) {
        tags.push(tag.Tag.Id);
      }

    });

    if (tags.length <= 0)
      return;

    this.currentPage = 1;

    this.filterByTags(tags);
  }

  filterByTags(tags: number[]) {

    this.searchTerm = '';
    this.priceSearchTerm = 0;
    this.productSearchingMode = ProductSearchingMode.Name;

    this.getProductsByPage(1, tags);
  }

  setSelectedProduct(data: number) {

    this.selectedProduct = this.pagingProducts.filter(p => p.Id == data)[0];

    let menuItems: string[] = ['Xem hình Sản phảm'];

    if (!this.selectedProduct.PriceList || this.selectedProduct.PriceList.length <= 0) {
      this.selectedProduct.PriceList = [this.selectedProduct.Price];
    }

    this.selectedProduct.PriceList.forEach(price => {

      menuItems.push(MyCurrPipe.currencyFormat(price));

    });

    this.menuOpening((pos) => {

      switch (+pos) {

        case 0:

          let url = ImgPipe.getImgUrl(this.selectedProduct.ImageUrl, ImgType.ProductImg);
          this.images = [url];
          
          setTimeout(() => {
            viewProductImg(url, () => {
              this.images = [];
            });
          }, 200);

          break;

        default:

          this.selectedProduct.Price = this.selectedProduct.PriceList[pos - 1];

          this.selectProduct();

          break;
      }

    }, menuItems);

  }

  getProductByCategory(category: number) {

    this.productCategory = category;
    this.searchTerm = '';
    this.priceSearchTerm = 0;
    this.productSearchingMode = ProductSearchingMode.Name;

    this.categoryName = this.categories.filter(p => p.Value === this.productCategory)[0].Name;

    this.getProductsByPage(this.currentPage);

  }

  filter() {
    selectProductCategory(this.categories, (val) => {
      filterFocus();
      this.getProductByCategory(+val);
    });
  }

  async getProductsByPage(page: number, tagIds: number[] = []) {

    this.globalTags.forEach(tag => {
      tag.IsSelected = false;
    });

    if (page <= 0) {
      return;
    }

    if (this.currentMaxPage < page && this.currentMaxPage > 0) {
      return;
    }

    this.pagingProducts = [];
    this.currentPage = page;
    this.selectedProduct = new Product();

    let prods: any;

    if (this.productSearchingMode != ProductSearchingMode.Price) {
      prods = await this.productService.getRecords(page, this.itemsPerPage, this.productCategory, tagIds, this.searchTerm)
    } else {
      prods = await this.productService.getRecordsByPrice(page, this.itemsPerPage, this.productCategory, this.priceSearchTerm);
    }

    if (prods && prods.products) {

      prods.products.forEach(product => {
        this.pagingProducts.push(product.Product);
      });

      this.currentMaxPage = prods.totalPages;

    } else
      this.currentMaxPage = 1;

  }

  searchProduct(term: string) {

    if (term.indexOf('k') == term.length - 1 || term.indexOf('K') == term.length - 1) {
      let newTerm = term.toLowerCase().split('k')[0];

      var price = parseInt(newTerm);

      if (price != NaN && price > 0) {

        this.productSearchingMode = ProductSearchingMode.Price;
        this.priceSearchTerm = price * 1000;
        this.searchTerm = '';
        console.log(this.priceSearchTerm);

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

    this.getProductsByPage(1);

  }

  selectProduct() {

    if (!this.selectedProduct.Id) {
      this.showError('Chưa có sản phẩm nào được chọn!!');
      return;
    }

    this.globalOrderDetail.ProductName = this.selectedProduct.Name;
    this.globalOrderDetail.ProductImageUrl = this.selectedProduct.ImageUrl;
    this.globalOrderDetail.ProductId = this.selectedProduct.Id;
    this.globalOrderDetail.IsFromHardCodeProduct = false;

    this.globalOrderDetail.OriginalPrice = this.selectedProduct.Price;
    this.globalOrderDetail.ModifiedPrice = this.selectedProduct.Price;

    this.OnBackNaviage();

  }
}
