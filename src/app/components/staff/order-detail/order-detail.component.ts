import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, retry } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { TempProduct } from 'src/app/models/entities/file.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { CategoryService } from 'src/app/services/category.service';
import { Promotion, PromotionType } from 'src/app/models/entities/Promotion.entity';
import { PromotionService } from 'src/app/services/Promotion.service';
import { promise } from 'protractor';

declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string): any;
declare function getTextInput(resCallback: (res: string) => void, placeHolder: string, oldValue: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
declare function selectProductCategory(menuitems: { Name: string; Value: number; }[], callback: (index: any) => void): any;
declare function hideReceiverPopup(): any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent implements OnDestroy {

  Title = 'Chi tiết đơn';

  detailIndex: number;

  promotions: Promotion[];

  categories: {
    Value: number,
    Name: string
  }[];

  constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService, private promotionService: PromotionService) {
    super();
    this.categories = [];
    this.promotions = [];
  }

  getPromotionAmount(promotion: Promotion): string {
    return promotion.PromotionType == PromotionType.Amount ? promotion.Amount + " ₫" : promotion.Amount + " %";
  }

  protected Init() {

    this.promotionService.getAvailablePromotions((new Date()).getTime())
      .then(promotions => {
        this.promotions = promotions;
      });

    this.route.params.subscribe(params => {

      this.detailIndex = + params.id;

      this.globalOrderDetail.AdditionalFee /= 1000;

      if (!this.globalOrderDetail.PurposeOf) this.globalOrderDetail.PurposeOf = 'Mua tặng';

      if (!this.globalOrderDetail.ProductName) this.globalOrderDetail.ProductName = '...';

      createNumbericElement(this.detailIndex > -1, (val) => {
        this.globalOrderDetail.Quantity = val;
      });

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

        });
    });

  }

  destroy() {
    if (this.globalOrderDetail) {
      this.globalOrderDetail.AdditionalFee *= 1000;
    }
  }

  clearProductImg() {

    if (!this.globalOrderDetail.ProductImageUrl)
      return;

    if (!this.globalOrderDetail.IsFromHardCodeProduct) {
      this.openConfirm('Chắc chăc xoá ảnh này? ', () => {
        this.globalOrderDetail.ProductImageUrl = '';

      });
    } else {
      this.globalOrderDetail.ProductImageUrl = '';
    }
  }

  productNameChangeRequest() {
    getTextInput(res => {
      this.globalOrderDetail.ProductName = res;
      this.globalOrderDetail.IsFromHardCodeProduct = true;
    }, 'Cập nhật tên sản phẩm...', this.globalOrderDetail.ProductName);
  }

  insertModifiedValue() {
    getNumberInput(res => {
      this.globalOrderDetail.ModifiedPrice = res;
    }, 'Cập nhật giá...');
  }

  searchProduct() {

    selectProductCategory(this.categories, (val) => {

      this.router.navigate(['/staff/search-product'], { queryParams: { category: +val }, queryParamsHandling: 'merge' });

    });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.globalOrderDetail.DeliveryInfo.Address
      || !this.globalOrderDetail.DeliveryInfo.PhoneNumber
      || !this.globalOrderDetail.DeliveryInfo.FullName
      || !this.globalOrderDetail.DeliveryInfo.DateTime) {
      this.showWarning('Thiếu thông in giao hàng!');
      return;
    }

    if (this.globalOrderDetail.ModifiedPrice <= 0) {
      this.showWarning('Chưa nhập giá tiền!');
      return;
    }

    if (!this.globalOrderDetail.IsFromHardCodeProduct && (!this.globalOrderDetail.ProductId || this.globalOrderDetail.ProductId <= 0)) {
      this.showWarning('Chưa chọn sản phẩm');
      return;
    }

    this.globalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.globalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.globalOrderDetail);

    this.insertOrderDetail(viewModel);

  }

  insertOrderDetail(viewModel: OrderDetailViewModel) {

    viewModel.AdditionalFee *= 1000;
    const newIndexes: number[] = [];

    if (this.detailIndex > -1) {

      this.globalOrder.OrderDetails[this.detailIndex] = viewModel;

    } else {

      let index = viewModel.Index;

      for (let i = 0; i < viewModel.Quantity; i++) {

        const subItem = OrderDetailViewModel.DeepCopy(viewModel);

        subItem.Quantity = 1;

        subItem.Index = index;

        this.globalOrder.OrderDetails.push(subItem);

        newIndexes.push(index);

        index += 1;
      }
    }

    super.OnBackNaviage();
  }

  selectPromotion(index: number) {

    this.globalOrderDetail.PercentDiscount = this.globalOrderDetail.AmountDiscount = 0;

    let promotion = this.promotions[index];

    if (promotion.PromotionType == PromotionType.Amount) {
      this.globalOrderDetail.AmountDiscount = promotion.Amount;
    } else {
      this.globalOrderDetail.PercentDiscount = promotion.Amount;
    }

    hideReceiverPopup();

  };
}
