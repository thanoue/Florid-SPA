import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order, OrderDetail, CustomerReceiverDetail } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { promise } from 'protractor';
import { OrderViewModel, OrderCustomerInfoViewModel, OrderDetailViewModel } from '../models/view.models/order.model';
import { or } from 'sequelize/types';
import { ExchangeService } from './exchange.service';
import { SaleTotalModel } from '../models/view.models/sale.total.model';
import { NgModelGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OrderService {



  constructor(private httpService: HttpService, private globalService: GlobalService) {
  }


  getOrderVMByRaw(order: any): OrderViewModel {

    let orderVM = new OrderViewModel();

    orderVM.OrderId = order.Id;
    orderVM.TotalAmount = order.TotalAmount;
    orderVM.TotalPaidAmount = order.TotalPaidAmount;
    orderVM.VATIncluded = order.VATIncluded;
    orderVM.OrderType = order.OrderType;
    orderVM.CreatedDate = new Date(order.CreatedDate);
    orderVM.PercentDiscount = order.PercentDiscount;
    orderVM.AmountDiscount = order.AmountDiscount;

    orderVM.CustomerInfo = new OrderCustomerInfoViewModel();
    orderVM.CustomerInfo.Id = order.CustomerId;

    orderVM.CustomerInfo.ScoreUsed = order.ScoreUsed;
    orderVM.CustomerInfo.GainedScore = order.GainedScore;

    if (order.customer) {
      orderVM.CustomerInfo.Name = order.customer.FullName;
      orderVM.CustomerInfo.PhoneNumber = order.customer.PhoneNumber;
      orderVM.CustomerInfo.AvailableScore = order.customer.AvailableScore;
      orderVM.CustomerInfo.DiscountPercent = ExchangeService.getMemberDiscountPercent(order.customer.MembershipType);
      orderVM.CustomerInfo.Id = order.customer.Id;
      orderVM.CustomerInfo.GainedScore = order.GainedScore;
      orderVM.CustomerInfo.ScoreUsed = order.ScoreUsed;
    }

    order.orderDetails.forEach(orderDetail => {

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
      orderDetailVM.MakingSortOrder = orderDetail.MakingSortOrder;
      orderDetailVM.ShippingSortOrder = orderDetail.ShippingSortOrder;
      orderDetailVM.IsVATIncluded = orderDetail.IsVATIncluded;
      orderDetailVM.Description = orderDetail.Description;
      orderDetailVM.CustomerName = orderDetail.CustomerName;
      orderDetailVM.CustomerPhoneNumber = orderDetail.CustomerPhoneNumber;
      orderDetailVM.HardcodeImageName = orderDetail.HardcodeImageName;
      orderDetailVM.PercentDiscount = orderDetail.PercentDiscount;
      orderDetailVM.AmountDiscount = orderDetail.AmountDiscount;
      orderDetailVM.DeliveryCompletedTime = orderDetail.DeliveryCompletedTime;
      orderDetailVM.MakingStartTime = orderDetail.MakingStartTime;
      orderDetailVM.MakingRequestTime = orderDetail.MakingRequestTime;
      orderDetailVM.MakingCompletedTime = orderDetail.MakingCompletedTime;
      orderDetailVM.ResultImageUrl = orderDetail.ResultImageUrl;
      orderDetailVM.MakingNote = orderDetail.MakingNote;
      orderDetailVM.DeliveryImageUrl = orderDetail.DeliveryImageUrl;
      orderDetailVM.ShippingNote = orderDetail.ShippingNote;
      orderDetailVM.FixingFloristId = orderDetailVM.FixingFloristId;

      orderVM.OrderDetails.push(orderDetailVM);

    });

    return orderVM;
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

  getById(id: string): Promise<OrderViewModel> {
    return this.httpService.post(API_END_POINT.getById, {
      id: id
    }).then(data => {
      return this.getOrderVMByRaw(data.order);
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

  getOrderViewModelsByStates(states: string[]): Promise<OrderViewModel[]> {

    return this.httpService.post(API_END_POINT.getOrdersByStates, {
      states: states
    }).then(orders => {

      return this.getOrderVMsByRaw(orders.orders);

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  searchByPhoneNumberOrCustomerName(term: string[]): Promise<OrderViewModel[]> {

    return this.httpService.post(API_END_POINT.searchByPhoneNumberOrCustomerName, {
      term: term
    }).then(orders => {

      return this.getOrderVMsByRaw(orders.orders);

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getNormalDayOrdersCount(): Promise<number> {
    return this.httpService.get(API_END_POINT.getNormalDayOrdersCount)
      .then(data => {
        return data.count;
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

  addOrderDetails(orderDetails: OrderDetail[]): Promise<any> {
    return this.httpService.post(API_END_POINT.addOrderDetails, {
      orderDetails: orderDetails
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  addOrEditOrder(order: Order, isEdit: boolean): Promise<Order> {
    console.log(order);
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
      amountDiscount: order.AmountDiscount
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
