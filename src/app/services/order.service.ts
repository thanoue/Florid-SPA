import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer, SpecialDay } from '../models/entities/customer.entity';
import { Order, OrderDetail, CustomerReceiverDetail, Shipping, Making } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { promise } from 'protractor';
import { OrderViewModel, OrderCustomerInfoViewModel, OrderDetailViewModel } from '../models/view.models/order.model';
import { ExchangeService } from './common/exchange.service';
import { SaleTotalModel } from '../models/view.models/sale.total.model';
import { NgModelGroup } from '@angular/forms';
import { Purchase } from '../models/view.models/purchase.entity';
import { OrderDetailStates } from '../models/enums';
import { User } from '../models/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpService: HttpService) {
  }

  getCustomerInfo(customer: Customer, order: OrderViewModel): OrderCustomerInfoViewModel {
    let info = new OrderCustomerInfoViewModel();

    info.Name = customer.FullName;
    info.PhoneNumber = customer.PhoneNumber;
    info.AvailableScore = customer.MembershipInfo.AvailableScore;
    info.DiscountPercent = ExchangeService.getMemberDiscountPercent(customer.MembershipInfo.MembershipType);
    info.Id = customer.Id;
    info.GainedScore = order.CustomerInfo.GainedScore;
    info.ScoreUsed = order.CustomerInfo.ScoreUsed;
    info.AccumulatedAmount = customer.MembershipInfo.AccumulatedAmount;
    info.Address = customer.Address.Home ? customer.Address.Home : customer.Address.Work ? customer.Address.Work : '';
    info.CustomerScoreUsedTotal = customer.MembershipInfo.UsedScoreTotal;

    info.ReceiverInfos = [];
    info.ReceiverInfos = [];

    customer.ReceiverInfos.forEach(receiver => {
      let item = new CustomerReceiverDetail();
      item.PhoneNumber = receiver.PhoneNumber;
      item.FullName = receiver.FullName;
      info.ReceiverInfos.push(item);
    });

    customer.SpecialDays.forEach(date => {
      let item = new SpecialDay();
      item.Date = date.Date;
      item.Description = date.Description;
      info.SpecialDays.push(item);
    });

    return info;
  }

  getOrderVMByRaw(order: any): OrderViewModel {

    let orderVM = new OrderViewModel();

    if (order == null)
      return null;

    orderVM.OrderId = order.Id;
    orderVM.TotalAmount = order.TotalAmount;
    orderVM.TotalPaidAmount = order.TotalPaidAmount;
    orderVM.VATIncluded = order.VATIncluded;
    orderVM.OrderType = order.OrderType;
    orderVM.CreatedDate = new Date(order.CreatedDate);
    orderVM.PercentDiscount = order.PercentDiscount;
    orderVM.AmountDiscount = order.AmountDiscount;
    orderVM.IsMemberDiscountApply = order.IsMemberDiscountApply;
    orderVM.DoneTime = !order.DoneTime || order.DoneTime <= 0 ? order.CreatedDate : order.DoneTime;

    if (order.purchases) {

      order.purchases.forEach(purchase => {

        var purchaseEntity = new Purchase();

        purchaseEntity.Id = purchase.Id;
        purchaseEntity.OrderId = purchase.OrderId;
        purchaseEntity.Amount = purchase.Amount;
        purchaseEntity.Method = purchase.Method;
        purchaseEntity.Note = purchase.Note;
        purchaseEntity.AddingTime = purchase.AddingTime;

        orderVM.PurchaseItems.push(purchaseEntity);

      });

    }

    orderVM.CustomerInfo = new OrderCustomerInfoViewModel();

    if (order.customer) {

      orderVM.CustomerInfo.Name = order.customer.FullName;
      orderVM.CustomerInfo.PhoneNumber = order.customer.PhoneNumber;
      orderVM.CustomerInfo.AvailableScore = order.customer.AvailableScore;
      orderVM.CustomerInfo.DiscountPercent = ExchangeService.getMemberDiscountPercent(order.customer.MembershipType);
      orderVM.CustomerInfo.Id = order.customer.Id;
      orderVM.CustomerInfo.GainedScore = order.GainedScore;
      orderVM.CustomerInfo.ScoreUsed = order.ScoreUsed;
      orderVM.CustomerInfo.AccumulatedAmount = order.customer.AccumulatedAmount;
      orderVM.CustomerInfo.Address = order.customer.HomeAddress ? order.customer.HomeAddress : order.customer.WorkAddress ? order.customer.WorkAddress : '';
      orderVM.CustomerInfo.CustomerScoreUsedTotal = order.customer.UsedScoreTotal;

      orderVM.CustomerInfo.ReceiverInfos = [];
      orderVM.CustomerInfo.ReceiverInfos = [];

    }

    if (order.orderdetails && order.orderdetails.length > 0) {

      order.orderdetails.forEach(orderDetail => {

        let orderDetailVM = new OrderDetailViewModel();

        orderDetailVM.ProductName = orderDetail.ProductName;
        orderDetailVM.OrderId = orderDetail.OrderId;
        orderDetailVM.OrderDetailId = orderDetail.Id.toString();
        orderDetailVM.State = orderDetail.State;
        orderDetailVM.ProductId = orderDetail.ProductId;
        orderDetailVM.ProductImageUrl = orderDetail.ProductImageUrl;
        orderDetailVM.Index = orderDetail.Index;
        orderDetailVM.DeliveryInfo.Address = orderDetail.ReceivingAddress;
        orderDetailVM.DeliveryInfo.DateTime = new Date(orderDetail.ReceivingTime);
        orderDetailVM.DeliveryInfo.FullName = orderDetail.ReceiverName;
        orderDetailVM.DeliveryInfo.PhoneNumber = orderDetail.ReceiverPhoneNumber;
        orderDetailVM.PurposeOf = orderDetail.PurposeOf;
        orderDetailVM.OriginalPrice = orderDetail.ProductPrice;
        orderDetailVM.ModifiedPrice = orderDetail.ProductPrice;
        orderDetailVM.AdditionalFee = orderDetail.AdditionalFee;
        orderDetailVM.IsVATIncluded = orderDetail.IsVATIncluded;
        orderDetailVM.Description = orderDetail.Description;
        orderDetailVM.CustomerName = orderDetail.CustomerName;
        orderDetailVM.IsFromHardCodeProduct = orderDetail.IsHardcodeProduct;
        orderDetailVM.CustomerPhoneNumber = orderDetail.CustomerPhoneNumber;
        orderDetailVM.HardcodeImageName = orderDetail.HardcodeImageName;
        orderDetailVM.PercentDiscount = orderDetail.PercentDiscount;
        orderDetailVM.AmountDiscount = orderDetail.AmountDiscount;
        orderDetailVM.MakingNote = orderDetail.MakingNote;
        orderDetailVM.ShippingNote = orderDetail.ShippingNote;
        orderDetailVM.Quantity = orderDetail.Quantity ? orderDetail.Quantity : 1;

        if (orderDetail.orderDedailShippings && orderDetail.orderDedailShippings.length > 0) {

          orderDetailVM.Shippings = [];

          orderDetail.orderDedailShippings.forEach(rawShipping => {

            let shipping = new Shipping();

            shipping.AssignTime = rawShipping.AssignTime;
            shipping.CompleteTime = rawShipping.CompleteTime;
            shipping.DeliveryImageUrl = rawShipping.DeliveryImageUrl;
            shipping.Id = rawShipping.Id;
            shipping.Note = rawShipping.Note;
            shipping.StartTime = rawShipping.StartTime;
            shipping.ShipperId = rawShipping.ShipperId;

            orderDetailVM.Shippings.push(shipping);

          });

        }

        if (orderDetail.shippers && orderDetail.shippers.length > 0) {

          orderDetailVM.Shippers = [];

          orderDetail.shippers.forEach(rawShipper => {

            let shipper = new User();

            shipper.Id = rawShipper.Id;
            shipper.AvtUrl = rawShipper.AvtUrl;
            shipper.Email = rawShipper.Email;
            shipper.FullName = rawShipper.FullName;
            shipper.IsExternalShipper = rawShipper.IsExternalShipper;
            shipper.PhoneNumber = rawShipper.PhoneNumber;

            orderDetailVM.Shippers.push(shipper);

          });

        }

        if (orderDetail.orderDetailMakings && orderDetail.orderDetailMakings.length > 0) {

          orderDetailVM.Makings = [];

          orderDetail.orderDetailMakings.forEach(rawMaking => {

            let making = new Making();

            making.AssignTime = rawMaking.AssignTime;
            making.CompleteTime = rawMaking.CompleteTime;
            making.ResultImageUrl = rawMaking.ResultImageUrl;
            making.Id = rawMaking.Id;
            making.StartTime = rawMaking.StartTime;
            making.FloristId = rawMaking.FloristId;

            orderDetailVM.Makings.push(making);

          });

        }

        if (orderDetail.florists && orderDetail.florists.length > 0) {

          orderDetailVM.Florists = [];

          orderDetail.florists.forEach(rawShipper => {

            let user = new User();

            user.Id = rawShipper.Id;
            user.AvtUrl = rawShipper.AvtUrl;
            user.Email = rawShipper.Email;
            user.FullName = rawShipper.FullName;
            user.IsExternalShipper = rawShipper.IsExternalShipper;
            user.PhoneNumber = rawShipper.PhoneNumber;

            orderDetailVM.Florists.push(user);

          });

        }

        orderDetailVM.NoteImages = orderDetail.NoteImages ? (orderDetail.NoteImages.split(',')) : [];

        orderVM.OrderDetails.push(orderDetailVM);

      });
    }


    return orderVM;
  }

  addBulk(orders: any[]): Promise<any> {
    return this.httpService.post(API_END_POINT.addBulkOrder, orders)
      .then(data => {
        return data.message;
      });
  }

  getSaleModels(orderVMs: OrderViewModel[]): SaleTotalModel[] {

    var models: SaleTotalModel[] = [];

    orderVMs.forEach(orderVM => {
      var model = new SaleTotalModel();

      model.OrderId = orderVM.OrderId;
      model.CreatedDate = orderVM.CreatedDate;
      model.CustomerId = orderVM.CustomerInfo.Id;
      model.CustomerName = orderVM.CustomerInfo.Name;
      model.CustomerPhoneNumber = orderVM.CustomerInfo.PhoneNumber;
      model.AmountTotal = orderVM.TotalAmount;
      model.FeeTotal = 0;
      model.DiscountTotal = 0;
      model.PriceTotal = 0;
      model.IsVATIncluded = orderVM.VATIncluded;

      orderVM.OrderDetails.forEach(orderDetail => {
        model.PriceTotal += orderDetail.ModifiedPrice;
        model.FeeTotal += orderDetail.AdditionalFee;
      });

      if (!orderVM.VATIncluded) {

        model.FinalTotal = model.AmountTotal;

      }
      else {

        model.FinalTotal = ExchangeService.getPreVATVal(model.AmountTotal);

      }

      model.DiscountTotal = (model.PriceTotal + model.FeeTotal) - model.FinalTotal;

      models.push(model);

    });

    models.sort((a, b) => a.CreatedDate < b.CreatedDate ? -1 : a.CreatedDate > b.CreatedDate ? 1 : 0);

    return models;
  }

  getSaleTotalByTimes(startTime: number, endTime: number): Promise<SaleTotalModel[]> {
    return this.httpService.post(API_END_POINT.getCompletedOrderByDayRange, {
      startDate: startTime,
      endDate: endTime
    }).then(orders => {

      var orderVMs = this.getOrderVMsByRaw(orders.orders);
      return this.getSaleModels(orderVMs);

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getSaleTotalByYear(year: number): Promise<SaleTotalModel[]> {

    let startTime = new Date();
    startTime.setFullYear(year, 0, 1);
    startTime.setHours(0, 0, 0, 0);

    let endTime = new Date();
    endTime.setFullYear(year, 11, 31);
    endTime.setHours(23, 59, 59, 0);

    return this.getSaleTotalByTimes(startTime.getTime(), endTime.getTime());
  }

  getSaleTotalByRange(times: number[]): Promise<SaleTotalModel[]> {

    let endDay = new Date(times[1]);
    endDay.setDate(endDay.getDate() + 1);

    return this.getSaleTotalByTimes(times[0], endDay.getTime());

  }

  getOrderVMsByRaw(orders: any): OrderViewModel[] {

    let orderVMs: OrderViewModel[] = [];

    if (!orders || orders.length <= 0)
      return [];

    orders.forEach(order => {

      orderVMs.push(this.getOrderVMByRaw(order));

    });

    return orderVMs;

  }


  getDebtOrders(page: number, size: number, startTime: number, endTime: number): Promise<{
    orders: OrderViewModel[],
    totalItemCount: number,
    totalPages: number
  }> {

    return this.httpService.post(API_END_POINT.getDebts, {
      page: page - 1,
      size: size,
      startTime: startTime,
      endTime: endTime
    }).then(data => {

      let res: {
        orders: OrderViewModel[],
        totalItemCount: number,
        totalPages: number
      } = {
        totalItemCount: 0,
        totalPages: 0,
        orders: []
      };

      res.totalItemCount = data.totalItemCount;
      res.totalPages = data.totalPages;
      res.orders = this.getOrderVMsByRaw(data.items);

      return res;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getById(id: string): Promise<OrderViewModel> {
    return this.httpService.post(API_END_POINT.getById, {
      id: id
    }).then(data => {
      if (data)
        return this.getOrderVMByRaw(data.order);
      return null;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });;
  }

  getSingleById(id: string): Promise<OrderViewModel> {
    return this.httpService.post(API_END_POINT.getOrderNotLazyById, {
      id: id
    }).then(data => {
      if (data)
        return this.getOrderVMByRaw(data.order);
      return null;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });;
  }

  updateFields(id: string, value: any): Promise<any> {
    return this.httpService.post(API_END_POINT.updateOrderFields, {
      obj: value,
      orderId: id
    }).then(res => {
      return res.result;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getOrderViewModelsByCusId(customerId: string): Promise<OrderViewModel[]> {
    return this.httpService.post(API_END_POINT.getOrdersByCustomerId, {
      customerId: customerId
    }).then(orders => {
      return this.getOrderVMsByRaw(orders.orders);
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  searchOrders(page: number, size: number, statues: OrderDetailStates[], term?: string): Promise<{
    orders: OrderViewModel[],
    totalItemCount: number,
    totalPages: number
  }> {

    return this.httpService.post(API_END_POINT.searchOrders, {
      term: term,
      page: page,
      size: size,
      statuses: statues
    }).then(data => {

      let res: {
        orders: OrderViewModel[],
        totalItemCount: number,
        totalPages: number
      } = {
        totalItemCount: 0,
        totalPages: 0,
        orders: []
      };

      res.totalItemCount = data.totalItemCount;
      res.totalPages = data.totalPages;
      res.orders = this.getOrderVMsByRaw(data.items);

      return res;//this.getOrderVMsByRaw(orders.orders);

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getMaxNumberId(year: number): Promise<number> {

    return this.httpService.post(API_END_POINT.getMaxOrderNumberId,
      {
        year: year
      })
      .then(data => {
        return data.max;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  deleteOrderDetailByOrderId(orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteOrderDetailByOrderId, {
      orderId: orderId
    })
      .then(res => {
        return;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  uploadNoteImg(fileData: File): Promise<string> {

    return this.httpService.postForm(API_END_POINT.uploadNoteImage, {
      noteImg: fileData
    }, false).then(data => {
      return data.imgName;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  addOrderDetails(orderDetails: OrderDetail[]): Promise<any> {

    console.log(orderDetails);

    return this.httpService.post(API_END_POINT.addOrderDetails, {
      orderDetails: orderDetails
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  updateOrderInfos(orderId: string, orderDetails: OrderDetail[], totalPaidAmount: number, customerId: string): Promise<any> {

    return this.httpService.post(API_END_POINT.updateOrderInfos, {
      orderDetails: orderDetails,
      orderId: orderId,
      totalPaidAmount: totalPaidAmount,
      customerId: customerId
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  addOrEditOrder(order: Order, isEdit: boolean): Promise<Order> {
    return this.httpService.post(isEdit ? API_END_POINT.editOrder : API_END_POINT.addOrder, {
      customerId: order.CustomerId,
      id: order.Id,
      vatIncluded: order.VATIncluded,
      totalAmount: order.TotalAmount,
      totalPaidAmount: order.TotalPaidAmount,
      gaindedScore: order.GainedScore,
      scoreUsed: order.ScoreUsed,
      orderType: order.OrderType,
      createdDate: order.Created,
      percentDiscount: order.PercentDiscount,
      amountDiscount: order.AmountDiscount,
      isMemberDiscountApply: order.IsMemberDiscountApply,
      doneTime: order.DoneTime
    })
      .then(data => {

        return order;

      })
      .catch(err => {

        this.httpService.handleError(err);

        throw err;
      });

  }


}
