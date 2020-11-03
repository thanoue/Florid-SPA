import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { PromotionService } from 'src/app/services/promotion.service';
import { NgForm } from '@angular/forms';
import { Promotion, PromotionType } from 'src/app/models/entities/promotion.entity';

declare function hideAdd(): any;
declare function showPromotionEditPopup(): any;

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Chương trình khuyến mãi', MenuItems.Promotion);

  isSelectAll: boolean = false;
  currentPage = 1;

  currentPromotion: Promotion;

  promotionTypes = PromotionType;

  Promotions: {
    Promotion: Promotion,
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

  constructor(private PromotionService: PromotionService) {
    super();
    this.currentPromotion = new Promotion();
  }

  addRequest() {
    this.currentPromotion = new Promotion();
    showPromotionEditPopup();
  }


  editRequest(promotion: Promotion) {

    this.currentPromotion = new Promotion();

    this.currentPromotion.Id = promotion.Id;
    this.currentPromotion.PromotionType = promotion.PromotionType;
    this.currentPromotion.Name = promotion.Name;
    this.currentPromotion.Amount = promotion.Amount;
    this.currentPromotion.StartTime = promotion.StartTime;
    this.currentPromotion.EndTime = promotion.EndTime;
    this.currentPromotion.IsEnable = promotion.IsEnable;

    showPromotionEditPopup();
  }

  addPromotion(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.currentPromotion.StartTime = new Date(this.currentPromotion.StartTime).getTime();
    this.currentPromotion.EndTime = new Date(this.currentPromotion.EndTime).getTime();

    if (this.currentPromotion.EndTime < this.currentPromotion.StartTime) {
      this.showError('Ngày bắt đầu và kết thúc không hợp lệ');
      return;
    }

    if (!this.currentPromotion.Id || this.currentPromotion.Id <= 0) {
      this.PromotionService.createPromotion(this.currentPromotion).then(res => {
        hideAdd();
        this.currentPromotion = new Promotion();
        this.pageChanged(this.currentPage);
      });
    }
    else {
      this.PromotionService.updatePromotion(this.currentPromotion).then(res => {
        hideAdd();
        this.currentPromotion = new Promotion();
        this.pageChanged(this.currentPage);
      });
    }
  }

  protected Init() {
    this._itemsPerPage = 10;
    this.pageChanged(1);
  }

  getPromotionAmount(promotion: Promotion): string {
    return promotion.PromotionType == PromotionType.Amount ? promotion.Amount + " ₫" : promotion.Amount + " %";
  }

  pageChanged(page: number) {

    this.currentPage = page;

    this.PromotionService.getRecords(page, this._itemsPerPage).then(promotions => {

      this.Promotions = [];
      this.itemTotalCount = promotions.totalItemCount;
      this.pageCount = promotions.totalPages;

      if (promotions.promotions) {
        promotions.promotions.forEach(promotion => {
          this.Promotions.push({
            Promotion: promotion,
            IsChecked: false
          });
        });
        console.log(promotions.promotions);
      }
    });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.Promotions.forEach(Promotion => {
      Promotion.IsChecked = isCheck;
    });
  }

  deletePromotions() {

    let PromotionIds: number[] = [];

    this.Promotions.forEach(Promotion => {
      if (Promotion.IsChecked) {
        PromotionIds.push(Promotion.Promotion.Id);
      }
    });

    if (PromotionIds.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá các chương trình khuyến mãi?', () => {
      this.PromotionService.deletePromotions(PromotionIds).then(re => {

        this.pageChanged(this.currentPage);

      });
    });
  }

  deletePromotion(Promotion: Promotion) {

    this.openConfirm('Chắc chắn xoá chương trình khuyến mãi?', () => {

      this.PromotionService.deletePromotion(Promotion.Id).then(re => {

        this.pageChanged(this.currentPage);

      });

    });

  }


}
