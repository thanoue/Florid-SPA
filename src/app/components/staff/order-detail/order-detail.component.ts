import { Component, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Promotion, PromotionType } from 'src/app/models/entities/promotion.entity';
import { PromotionService } from 'src/app/services/promotion.service';
import { ImgPipe } from 'src/app/pipes/img.pipe';
import { ImgType } from 'src/app/app.constants';

declare function openFixPriceDialog(): any;
declare function dismissFixPriceDialog(): any;
declare function getTextInput(resCallback: (res: string) => void, placeHolder: string, oldValue: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
declare function viewProductImg(url: string, onCancel: () => void): any;
declare function hideReceiverPopup(): any;
declare function viewImages(onCancel: () => void): any;

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
  isAddingNoteImage = false;
  images: string[];

  constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService, private promotionService: PromotionService) {
    super();
    this.promotions = [];
    this.images = [];

    if (!this.globalOrderDetail.NoteImages) this.globalOrderDetail.NoteImages = [];

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

    });

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

  addNoteImage() {
    this.isAddingNoteImage = true;
    super.openFileForShare();
  }

  protected fileChosen(path: string) {

    this.globalOrderDetail.NoteImages.push('data:image/png;base64,' + path);
    
  }

  onChange(event) {

    const filesUpload: File = event.target.files[0];

    if (!filesUpload)
      return;

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {

      this.globalOrderDetail.NoteImages.push(reader.result.toString());

    }

  }

  selectNoteImage(index: number) {
    this.menuOpening((pos) => {

      switch (+pos) {

        case 0:

          this.globalOrderDetail.NoteImages.splice(index, 1);

          break;

        case 1:

          let url = ImgPipe.getImgUrl(this.globalOrderDetail.NoteImages[index], ImgType.NoteImg);
          this.images = [url];

          setTimeout(() => {
            viewImages(() => {
              this.images = [];
            });
          }, 100);

          break;
      }

    }, ['Xoá ảnh', 'Xem chi tiết ảnh']);
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

    this.router.navigate(['/staff/search-product'], { queryParams: { category: -1 }, queryParamsHandling: 'merge' });

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
