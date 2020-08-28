import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, MembershipTypes, OrderType } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { Order, OrderDetail, CustomerReceiverDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';
import { District, Ward } from 'src/app/models/entities/address.entity';
import { AddressService } from 'src/app/services/address.service';
import { PrintSaleItem, PrintJob } from 'src/app/models/entities/printjob.entity';
import { Guid } from 'guid-typescript';
import { PrintJobService } from 'src/app/services/print-job.service';
import { LocalService } from 'src/app/services/common/local.service';
import { Promotion, PromotionType } from 'src/app/models/entities/Promotion.entity';
import { PromotionService } from 'src/app/services/Promotion.service';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;
declare function getNumberValidateInput(resCallback: (res: number, validCallback: (isvalid: boolean, error: string) => void) => void, placeHolder: string, oldValue: number): any;
declare function hideReceiverPopup(): any;

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent extends BaseComponent {

  Title = 'Thêm Đơn';
  memberShipTitle = '';
  order: OrderViewModel;
  totalBalance = 0;
  isResetPaidAmount = false;
  originalOrderId = '';
  promotions: Promotion[];

  constructor(private orderDetailService: OrderDetailService, private router: Router,
    // tslint:disable-next-line: align
    private orderService: OrderService,
    // tslint:disable-next-line: align
    private customerService: CustomerService,

    // tslint:disable-next-line: align
    private printJobService: PrintJobService,
    private promotionService: PromotionService) {
    super();
    this.promotions = [];
  }


  protected Init() {

    this.promotionService.getAvailablePromotions((new Date()).getTime())
      .then(promotions => {
        this.promotions = promotions;
      });

    this.order = this.globalOrder;

    if (!this.isEdittingOrder) {

      this.memberShipTitle = 'New Customer';

      this.orderService.getNormalDayOrdersCount()
        .then(count => {

          this.order.OrderId = (count + 1).toString();
          this.originalOrderId = this.order.OrderId;
          this.order.OrderType = OrderType.NormalDay;

        });

    } else {

      this.originalOrderId = this.order.OrderId;
      this.onVATIncludedChange();
    }

    switch (this.order.CustomerInfo.MembershipType) {
      case MembershipTypes.NewCustomer:
        this.memberShipTitle = 'New Customer';
        break;
      case MembershipTypes.Member:
        this.memberShipTitle = 'Member';
        break;
      case MembershipTypes.Vip:
        this.memberShipTitle = 'VIP';
        break;
      case MembershipTypes.VVip:
        this.memberShipTitle = 'VVIP';
        break;
      default:
        this.memberShipTitle = 'New Customer';
        break;
    }

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
  }

  getPromotionAmount(promotion: Promotion): string {
    return promotion.PromotionType == PromotionType.Amount ? promotion.Amount + " ₫" : promotion.Amount + " %";
  }

  selectPromotion(index: number) {

    this.order.AmountDiscount = this.order.PercentDiscount = 0;

    let promotion = this.promotions[index];

    if (promotion.PromotionType == PromotionType.Amount) {
      this.order.AmountDiscount = promotion.Amount;
    } else {
      this.order.PercentDiscount = promotion.Amount;
    }

    hideReceiverPopup();

  };

  requestPaidInput() {

    if (!this.order.CustomerInfo.Id) {
      this.showWarning('Thiếu thông tin Khách hàng!');
      return;
    }

    if (!this.order.OrderDetails || this.order.OrderDetails.length <= 0) {
      this.showWarning('Chưa chọn sản phẩm nào!');
      return;
    }

    if (!this.order.TotalAmount || this.order.TotalAmount <= 0) {
      this.showWarning('Thành tiền không hợp lệ!');
      return;
    }

    if (this.totalBalance < 0) {

      this.openConfirm('Trả lại tiền thừa cho khách hàng : ' + this.totalBalance.toString(), () => {

        this.isResetPaidAmount = true;
        this.totalBalance = 0;

        this.printConfirm();

      });

      return;
    }

    if (this.totalBalance === 0) {
      this.printConfirm();
      return;
    }

    getNumberValidateInput((res, validateCallback) => {

      if (res > this.totalBalance) {
        validateCallback(false, 'Thanh toán vượt quá thành tiền!');
        return;

      } else if (res <= 0) {
        validateCallback(false, 'Thanh toán phải lớn hơn 0!');
        return;
      }

      validateCallback(true, '');
      this.doingPay(res);

    }, 'Số tiền đã thanh toán...', this.totalBalance);

  }

  doingPay(res: number) {

    this.order.TotalPaidAmount += res;

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

    if (!this.order.CreatedDate) { this.order.CreatedDate = new Date(); }

    this.order.CustomerInfo.GainedScore = ExchangeService.getGainedScore(this.order.TotalAmount);

    this.printConfirm();
  }

  printConfirm() {

    this.openConfirm('In hoá đơn?', () => {

      if (this.isResetPaidAmount) {
        this.order.TotalPaidAmount = this.order.TotalAmount;
      }

      let tempSummary = 0;
      const products: PrintSaleItem[] = [];

      this.order.OrderDetails.forEach(product => {
        products.push({
          productName: product.ProductName,
          index: product.Index + 1,
          price: product.ModifiedPrice,
          additionalFee: product.AdditionalFee
        });
        tempSummary += product.ModifiedPrice;
      });

      const orderData: PrintJob = {
        Created: (new Date()).getTime(),
        Id: this.order.OrderId,
        Active: true,
        IsDeleted: false,
        saleItems: products,
        createdDate: this.order.CreatedDate.toLocaleString('vi-VN', { hour12: true }),
        orderId: this.order.OrderId,
        summary: tempSummary,
        totalAmount: this.order.TotalAmount,
        totalPaidAmount: this.order.TotalPaidAmount,
        totalBalance: this.totalBalance,
        vatIncluded: this.order.VATIncluded,
        memberDiscount: this.order.CustomerInfo.DiscountPercent,
        scoreUsed: this.order.CustomerInfo.ScoreUsed,
        gainedScore: this.order.CustomerInfo.GainedScore,
        totalScore: this.order.CustomerInfo.AvailableScore - this.order.CustomerInfo.ScoreUsed + this.order.CustomerInfo.GainedScore,
        customerName: this.order.CustomerInfo.Name
      };

      this.printJobService.addPrintJob(orderData);
      this.orderConfirm();

    }, () => {

      this.orderConfirm();

    }, () => {

      if (this.isResetPaidAmount) {
        this.isResetPaidAmount = false;
        this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
      }

    });

  }

  orderConfirm() {

    if (this.isResetPaidAmount) {
      this.order.TotalPaidAmount = this.order.TotalAmount;
    }

    this.startLoading();

    const orderDB = new Order();

    if (this.originalOrderId != this.order.OrderId) {
      this.order.OrderType = OrderType.SpecialDay;
    }

    orderDB.CustomerId = this.order.CustomerInfo.Id;
    orderDB.Id = this.order.OrderId;
    orderDB.Created = this.order.CreatedDate.getTime();
    orderDB.VATIncluded = this.order.VATIncluded;
    orderDB.TotalAmount = this.order.TotalAmount;
    orderDB.TotalPaidAmount = this.order.TotalPaidAmount;
    orderDB.GainedScore = this.order.CustomerInfo.GainedScore;
    orderDB.ScoreUsed = this.order.CustomerInfo.ScoreUsed;
    orderDB.Index = this.order.Index;
    orderDB.OrderType = this.order.OrderType;
    orderDB.PercentDiscount = this.order.PercentDiscount;
    orderDB.AmountDiscount = this.order.AmountDiscount;

    this.orderService.addOrEditOrder(orderDB, this.isEdittingOrder)
      .then(async res => {

        const orderDetails: OrderDetail[] = [];
        const receiverInfos: CustomerReceiverDetail[] = [];

        this.order.OrderDetails.forEach(detailVM => {

          const detail = new OrderDetail();

          detail.OrderId = orderDB.Id;
          detail.IsHardcodeProduct = detailVM.IsFromHardCodeProduct;
          detail.HardcodeProductImageName = detailVM.HardcodeImageName;
          detail.ProductId = detailVM.ProductId;
          detail.ProductImageUrl = detailVM.ProductImageUrl;
          detail.ProductPrice = detailVM.ModifiedPrice;
          detail.AdditionalFee = detailVM.AdditionalFee;
          detail.ProductName = detailVM.ProductName;
          detail.Description = detailVM.Description;
          detail.State = OrderDetailStates.Added;
          detail.IsVATIncluded = orderDB.VATIncluded;
          detail.PurposeOf = detailVM.PurposeOf;
          detail.Index = detailVM.Index;
          detail.PercentDiscount = detailVM.PercentDiscount;
          detail.AmountDiscount = detailVM.AmountDiscount;

          detail.CustomerName = this.order.CustomerInfo.Name;
          detail.CustomerPhoneNumber = this.order.CustomerInfo.PhoneNumber;


          detail.DeliveryInfo.ReceivingTime = detailVM.DeliveryInfo.DateTime.getTime();

          const receiverInfo = new CustomerReceiverDetail();

          receiverInfo.Address = detailVM.DeliveryInfo.Address;
          receiverInfo.PhoneNumber = detailVM.DeliveryInfo.PhoneNumber;
          receiverInfo.FullName = detailVM.DeliveryInfo.FullName;

          detail.DeliveryInfo.ReceiverDetail = receiverInfo;

          orderDetails.push(detail);

          let isAdd = true;

          receiverInfos.forEach(info => {

            if (ExchangeService.receiverInfoCompare(info, receiverInfo)) {
              isAdd = false;
              return;
            }

          });

          if (isAdd) {
            receiverInfos.push(receiverInfo);
          }

        });

        this.globalOrder.CustomerInfo.ReceiverInfos.forEach(receiver => {

          let isAdd = true;

          receiverInfos.forEach(item => {

            if (ExchangeService.receiverInfoCompare(receiver, item)) {
              isAdd = false;
              return;
            }

          });

          if (isAdd) {
            receiverInfos.push(receiver);
          }

        });

        await this.orderService.deleteOrderDetailByOrderId(orderDB.Id);

        this.orderService.addOrderDetails(orderDetails)
          .then(() => {

            this.customerService.updateReceiverList(orderDB.CustomerId, receiverInfos).then(isSuccess => {

              this.stopLoading();

              if (isSuccess) {
                this.OnBackNaviage();
              }

            });

          })
          .catch(error => {

            console.log(error);
            this.globalService.stopLoading();
            this.showError(error.toString());

          });
      });
  }

  totalAmountCalculate(isVATIncluded: boolean) {

    this.order.TotalAmount = 0;

    this.order.OrderDetails.forEach(detail => {

      if (!detail.AdditionalFee) {
        detail.AdditionalFee = 0;
      }

      let amount = 0;

      //member discount;
      if (this.order.CustomerInfo && this.order.CustomerInfo.DiscountPercent)
        amount = detail.ModifiedPrice - (detail.ModifiedPrice / 100) * this.order.CustomerInfo.DiscountPercent;

      if (detail.AmountDiscount && detail.AmountDiscount > 0)
        amount = detail.ModifiedPrice - (detail.ModifiedPrice / 100) * this.order.CustomerInfo.DiscountPercent;

      this.order.TotalAmount += ExchangeService.getFinalPrice(detail.ModifiedPrice, this.order.CustomerInfo.DiscountPercent, detail.AdditionalFee);

    });

    if (isVATIncluded) {
      this.order.TotalAmount += (this.order.TotalAmount / 100) * 10;
    }

    this.order.TotalAmount -= ExchangeService.geExchangableAmount(this.order.CustomerInfo.ScoreUsed);

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

  }



  onVATIncludedChange() {
    this.totalAmountCalculate(this.order.VATIncluded);
  }

  scoreExchange() {

    openExcForm((res, validateCalback) => {

      if (this.order.CustomerInfo.AvailableScore < res) {

        this.showError('Vượt quá điểm tích lũy!!');

        validateCalback.call(this, false);

        return;

      }

      const exchangeAmount = ExchangeService.geExchangableAmount(res);

      if (exchangeAmount >= this.totalBalance) {

        this.showError('Vượt quá tổng tiền thanh toán!');

        validateCalback.call(this, false);

        return;

      }

      validateCalback.call(this, true);

      this.order.CustomerInfo.ScoreUsed = res;

      this.onVATIncludedChange();

    });

  }

  addNewOrderDetail() {

    this.globalOrderDetail = new OrderDetailViewModel();

    this.router.navigate([`/staff/order-detail/-1`]);
  }

  editOrderDetail(index: number) {

    const viewModel = OrderDetailViewModel.DeepCopy(this.order.OrderDetails[index]);

    this.globalOrderDetail = viewModel;

    this.router.navigate([`/staff/order-detail/${index}`]);

  }

  deleteOrderDetail(index: number) {
    // confirm here
    this.openConfirm('Chắc chắn xoá?', () => {
      this.order.OrderDetails.splice(index, 1);

      let tempIndex = 0;

      this.order.OrderDetails.forEach(item => {
        item.Index = tempIndex;
        tempIndex++;
      });

      this.onVATIncludedChange();

    });
  }
}
