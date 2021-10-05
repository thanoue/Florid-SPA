import { Injectable } from '@angular/core';
import { Promotion, PromotionType } from '../models/entities/promotion.entity';
import { GlobalService } from './common/global.service';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private htttpService: HttpService, private globalService: GlobalService) {
  }

  formatDate(time: number): number {
    const startTime = new Date(time);
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    return startTime.getTime();
  }


  createPromotion(promotion: Promotion): Promise<any> {

    promotion.StartTime = this.formatDate(promotion.StartTime);
    promotion.EndTime = this.formatDate(promotion.EndTime);

    return this.htttpService.post(API_END_POINT.createPromotion, {
      amount: promotion.Amount,
      promotionType: promotion.PromotionType,
      name: promotion.Name,
      startTime: promotion.StartTime,
      endTime: promotion.EndTime,
      isEnable: promotion.IsEnable
    }).then((res) => {

      return res;

    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }

  updatePromotion(promotion: Promotion): Promise<any> {

    promotion.StartTime = this.formatDate(promotion.StartTime);
    promotion.EndTime = this.formatDate(promotion.EndTime);

    return this.htttpService.post(API_END_POINT.updatePromotion, {
      amount: promotion.Amount,
      promotionType: promotion.PromotionType,
      name: promotion.Name,
      startTime: promotion.StartTime,
      endTime: promotion.EndTime,
      isEnable: promotion.IsEnable,
      id: promotion.Id
    }).then((res) => {

      return res;

    }).catch(err => {

      this.htttpService.handleError(err);

    });
  }


  deletePromotion(id: number): Promise<any> {

    return this.htttpService.post(API_END_POINT.deletePromotion, {
      id
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttpService.handleError(err);
    });
  }

  deletePromotions(ids: number[]): Promise<any> {

    return this.htttpService.post(API_END_POINT.deletePromotions, {
      promotionIds: ids
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttpService.handleError(err);
    });

  }

  getAvailablePromotions(currentTime: number, isLoad: boolean = true) {

    const currentDate = this.formatDate(currentTime);

    return this.htttpService.post(API_END_POINT.getAvailable, {
      currentDate
    }, isLoad).then(res => {

      const promotions: Promotion[] = [];

      res.promotions.forEach(rawPromotion => {
        promotions.push(this.getPromotionFromRaw(rawPromotion));
      });

      return promotions;

    }).catch(err => {

      this.htttpService.handleError(err);
      throw err;

    });
  }

  getAll(): Promise<Promotion[]> {
    return this.htttpService.get(API_END_POINT.getAllPromotions)
      .then(datas => {

        const promotions: Promotion[] = [];

        datas.forEach(rawPromotion => {
          promotions.push(this.getPromotionFromRaw(rawPromotion));
        });

        return promotions;
      })
      .catch(err => {
        this.htttpService.handleError(err);
        throw err;
      });
  }

  private getPromotionFromRaw(rawPromotion: any): Promotion {
    const promotion = new Promotion();

    promotion.Id = rawPromotion.Id;
    promotion.PromotionType = rawPromotion.PromotionType == 'Amount' ? PromotionType.Amount : PromotionType.Percent;
    promotion.Name = rawPromotion.Name;
    promotion.Amount = rawPromotion.Amount;
    promotion.StartTime = rawPromotion.StartTime;
    promotion.EndTime = rawPromotion.EndTime;
    promotion.IsEnable = rawPromotion.IsEnable;

    return promotion;
  }

  getRecords(page: number, itemsPerPage: number, nameTerm: string = ''): Promise<{
    promotions: Promotion[],
    totalItemCount: number,
    totalPages: number
  }> {
    return this.htttpService.get(API_END_POINT.getPromotions, {
      page: page - 1,
      size: itemsPerPage,
      name: nameTerm
    }).then(datas => {

      if (!datas) {
        return null;
      }

      const res: any = {};

      res.totalItemCount = +datas.totalItemCount;
      res.totalPages = +datas.totalPages;
      res.promotions = [];

      if (datas.items) {

        datas.items.forEach(item => {
          res.promotions.push(this.getPromotionFromRaw(item));
        });

      }

      return res;

    }).catch(err => {
      this.htttpService.handleError(err);
      throw err;
    });

  }

}
