import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, MembershipTypes, OrderType, PurchaseStatus, PurchaseMethods } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { Order, OrderDetail, CustomerReceiverDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';
import { PrintSaleItem, PrintJob } from 'src/app/models/entities/printjob.entity';
import { PrintJobService } from 'src/app/services/print-job.service';
import { Promotion, PromotionType } from 'src/app/models/entities/promotion.entity';
import { PromotionService } from 'src/app/services/promotion.service';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { throwIfEmpty } from 'rxjs/operators';
import { PurchaseService } from 'src/app/services/purchase.service';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;
declare function dismissPurchaseDialog();
declare function hideReceiverPopup(): any;
declare function purchaseDoing(): any;
declare function moveCursor(id: string, pos: number);
declare function openQR(): any;

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
  orderDiscount = 0;
  promotions: Promotion[];
  isPurchased = false;
  currentPurStatus: PurchaseStatus;
  currentPurType: PurchaseMethods;
  purchaseType = PurchaseMethods;
  currentPayAmount: number;
  qrContent: string;
  qrContentTemplate = "123456789";

  constructor(private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private printJobService: PrintJobService,
    private promotionService: PromotionService,
    private purchaseService: PurchaseService) {
    super();
    this.promotions = [];
    this.currentPayAmount = 0;
    this.qrContent = "";
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

      this.onVATIncludedChange();

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

    this.onVATIncludedChange();
  };

  requestPaidInput() {

    if (!this.order.CustomerInfo.Id) {
      this.showError('Thiếu thông tin Khách hàng!');
      return;
    }

    if (!this.order.OrderDetails || this.order.OrderDetails.length <= 0) {
      this.showError('Chưa chọn sản phẩm nào!');
      return;
    }

    if (!this.order.TotalAmount || this.order.TotalAmount <= 0) {
      this.showError('Thành tiền không hợp lệ!');
      return;
    }

    if (this.order.TotalPaidAmount <= 0) {

      this.openConfirm('Hoá đơn chưa được thanh toán, có muốn tiếp tục?', () => {

        purchaseDoing();

      }, () => {

        this.printConfirm();

      }, null, 'Thanh Toán', 'Tiếp tục');

    } else {
      this.printConfirm();
    }
  }

  selectPurType(purchaseType: PurchaseMethods) {

    if (this.currentPayAmount <= 0) {
      this.showError('Yêu cầu nhập số tiền trước');
      return;
    }

    this.currentPurType = purchaseType;

    if (purchaseType == PurchaseMethods.Momo) {
      openQR();
    }

  }

  purchaseConfirm() {

    if (this.currentPayAmount > this.totalBalance) {
      this.showError('Số tiền không hợp lệ!');
      return;
    }

    let purchase = new Purchase();

    this.qrContent = this.qrContentTemplate + this.currentPayAmount.toString();

    purchase.OrderId = this.order.OrderId;
    purchase.Amount = this.currentPayAmount;
    purchase.Method = this.currentPurType;
    purchase.Status = this.currentPurStatus;

    this.globalPurchases.push(purchase);

    this.order.TotalPaidAmount += purchase.Amount;

    this.currentPayAmount = 0;

    this.showSuccess('Đã thêm 1 thanh toán!');

    this.totalAmountCalculate(this.order.VATIncluded);

    if (this.order.TotalPaidAmount >= this.order.TotalAmount) {
      dismissPurchaseDialog();
    }

  }

  doPrintJob() {

    let tempSummary = 0;
    const products: PrintSaleItem[] = [];

    this.order.OrderDetails.forEach(product => {
      products.push({
        productName: product.ProductName,
        index: product.Index + 1,
        price: product.ModifiedPrice,
        additionalFee: product.AdditionalFee,
        discount: this.getDetailDiscount(product)
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
      customerName: this.order.CustomerInfo.Name,
      discount: this.orderDiscount
    };

    this.printJobService.addPrintJob(orderData);

    this.orderConfirm();
  }

  printConfirm() {

    if (!this.order.CreatedDate) { this.order.CreatedDate = new Date(); }

    this.order.CustomerInfo.GainedScore = ExchangeService.getGainedScore(this.order.TotalAmount);

    this.openConfirm('In hoá đơn?', () => {

      if (this.isResetPaidAmount) {
        this.order.TotalPaidAmount = this.order.TotalAmount;
      }

      this.doPrintJob();

    }, () => {

      this.orderConfirm();

    }, () => {

      this.orderConfirm();

    });

  }

  orderConfirm() {

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

        if (this.globalPurchases.length > 0) {
          console.log(this.globalPurchases);
          this.purchaseService.bulkCreate(this.globalPurchases, orderDB.Id)
            .then(data => {
              this.globalPurchases = [];
            });
        }

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

    let isWillApplyMemberDiscount = true;

    if (this.order.AmountDiscount > 0 || this.order.PercentDiscount > 0)
      isWillApplyMemberDiscount = false;

    this.order.OrderDetails.forEach(detail => {
      if (detail.PercentDiscount > 0 || detail.AmountDiscount > 0) {
        isWillApplyMemberDiscount = false;
      }
    });

    this.order.OrderDetails.forEach(detail => {

      if (!detail.AdditionalFee) {
        detail.AdditionalFee = 0;
      }

      let amount = detail.ModifiedPrice;

      if (detail.PercentDiscount && detail.PercentDiscount > 0)
        amount -= (detail.ModifiedPrice / 100) * detail.PercentDiscount;

      if (detail.AmountDiscount && detail.AmountDiscount > 0)
        amount -= detail.AmountDiscount;

      if (this.order.CustomerInfo && this.order.CustomerInfo.DiscountPercent && this.order.CustomerInfo.DiscountPercent > 0)
        this.order.TotalAmount += ExchangeService.getFinalPrice(amount, this.order.CustomerInfo.DiscountPercent, detail.AdditionalFee, isWillApplyMemberDiscount);
      else
        this.order.TotalAmount = amount + detail.AdditionalFee;

    });

    this.orderDiscount = 0;

    if (this.order.PercentDiscount && this.order.PercentDiscount > 0) {
      this.orderDiscount = (this.order.TotalAmount / 100) * this.order.PercentDiscount
      this.order.TotalAmount -= this.orderDiscount;
    }

    if (this.order.AmountDiscount && this.order.AmountDiscount > 0) {
      this.order.TotalAmount = this.order.TotalAmount - this.order.AmountDiscount;
      this.orderDiscount += this.order.AmountDiscount;
    }

    if (isVATIncluded) {
      this.order.TotalAmount = this.order.TotalAmount + this.order.TotalAmount * 0.1;
    }

    this.order.TotalAmount -= ExchangeService.geExchangableAmount(this.order.CustomerInfo.ScoreUsed);

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
  }

  getDetailDiscount(orderDetail: OrderDetailViewModel): number {

    let discount = 0;

    if (orderDetail.PercentDiscount && orderDetail.PercentDiscount > 0)
      discount = (orderDetail.ModifiedPrice / 100) * orderDetail.PercentDiscount;

    if (orderDetail.AmountDiscount && orderDetail.AmountDiscount > 0)
      discount = discount + orderDetail.AmountDiscount;

    return discount;
  }

  onDiscountChanged(value) {
    this.onVATIncludedChange();
  }

  onAmountDiscountChanged(value) {

    this.onAcmountDiscountFocus();

    this.order.AmountDiscount = +this.order.AmountDiscount;

    this.onVATIncludedChange();

  }

  onAcmountDiscountFocus() {

    if (!this.order.AmountDiscount) {
      this.order.AmountDiscount = 0;
    }

    if (this.order.AmountDiscount < 1000) {
      this.order.AmountDiscount *= 1000;
    }

    var length = this.order.AmountDiscount.toString().length;

    setTimeout(() => {
      moveCursor('AmountDiscount', length - 3);
    }, 10);

  }

  onAcmountDiscountBlur() {

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
