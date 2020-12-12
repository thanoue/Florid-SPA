import { Component, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Promotion, PromotionType } from 'src/app/models/entities/promotion.entity';
import { PromotionService } from 'src/app/services/promotion.service';
import { promise } from 'protractor';

declare function openFixPriceDialog(): any;
declare function dismissFixPriceDialog(): any;
declare function getTextInput(resCallback: (res: string) => void, placeHolder: string, oldValue: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
declare function selectProductCategory(menuitems: { Name: string; Value: number; }[], callback: (index: any) => void): any;
declare function hideReceiverPopup(): any;
declare function moveCursor(id: string, pos: number);

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent implements OnDestroy {

  Title = 'Chi tiết đơn';

  detailIndex: number;

  promotions: Promotion[];

  newPrice: number;

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

  onAmountDiscountChanged(value) {

    if (this.globalOrderDetail.AmountDiscount < 10) {

      this.globalOrderDetail.AmountDiscount *= 1000;

      this.moveCursor(this.globalOrderDetail.AmountDiscount.toString().length, 'AmountDiscount');

    }

    this.globalOrderDetail.AmountDiscount = +this.globalOrderDetail.AmountDiscount;

  }

  onAcmountDiscountFocus() {

    if (!this.globalOrderDetail.AmountDiscount) {
      this.globalOrderDetail.AmountDiscount = 0;
    }

    this.moveCursor(this.globalOrderDetail.AmountDiscount.toString().length, 'AmountDiscount');
  }

  onAddFeeChanged(value) {

    if (this.globalOrderDetail.AdditionalFee < 10) {

      this.globalOrderDetail.AdditionalFee *= 1000;

      this.moveCursor(this.globalOrderDetail.AdditionalFee.toString().length, 'AdditionalFee');

    }

    this.globalOrderDetail.AdditionalFee = +this.globalOrderDetail.AdditionalFee;

  }

  onAddFeeFocus() {

    if (!this.globalOrderDetail.AdditionalFee) {
      this.globalOrderDetail.AdditionalFee = 0;
    }

    this.moveCursor(this.globalOrderDetail.AdditionalFee.toString().length, 'AdditionalFee');

  }

  onNewPriceChanged(value) {

    if (this.newPrice < 10) {

      this.newPrice *= 1000;

      this.moveCursor(this.newPrice.toString().length, 'NewPrice');

    }

    this.newPrice = +this.newPrice;

  }

  onNewPriceFocus() {

    if (!this.newPrice) {
      this.newPrice = 0;
    }

    this.moveCursor(this.newPrice.toString().length, 'NewPrice');
  }

  protected Init() {

    this.promotionService.getAvailablePromotions((new Date()).getTime(), false)
      .then(promotions => {
        this.promotions = promotions;
      });

    this.route.params.subscribe(params => {

      this.detailIndex = + params.id;

      if (!this.globalOrderDetail.PurposeOf) this.globalOrderDetail.PurposeOf = 'Mua tặng';

      if (!this.globalOrderDetail.ProductName) this.globalOrderDetail.ProductName = '....';

      createNumbericElement(false, (val) => {
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

      if (res == '')
        return;

      this.globalOrderDetail.ProductName = res;
      this.globalOrderDetail.IsFromHardCodeProduct = true;

    }, 'Cập nhật tên sản phẩm...', this.globalOrderDetail.ProductName == '....' ? '' : this.globalOrderDetail.ProductName);

  }

  insertModifiedValue() {

    this.newPrice = this.globalOrderDetail.ModifiedPrice;

    openFixPriceDialog();

  }

  submitPrice() {

    if (this.newPrice < 0) {
      this.showError('Số tiền không hợp lệ!!');
      return;
    }

    this.globalOrderDetail.ModifiedPrice = this.newPrice;
    dismissFixPriceDialog();
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

    if (this.globalOrderDetail.ModifiedPrice <= 0) {
      this.showError('Chưa nhập giá tiền!');
      return;
    }

    this.globalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.globalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.globalOrderDetail);

    this.insertOrderDetail(viewModel);
  }

  insertOrderDetail(viewModel: OrderDetailViewModel) {


    if (this.detailIndex > -1) {

      this.globalOrder.OrderDetails[this.detailIndex] = viewModel;


    } else {

      this.globalOrder.OrderDetails.push(viewModel);

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
