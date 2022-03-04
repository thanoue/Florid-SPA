import { Injectable } from '@angular/core';
import { Customer, MembershipInfo, SpecialDay } from '../models/entities/customer.entity';
import { Order, OrderDetail, CustomerReceiverDetail, Shipping, Making } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';
import { OrderViewModel, OrderCustomerInfoViewModel, OrderDetailViewModel } from '../models/view.models/order.model';
import { ExchangeService } from './common/exchange.service';
import { SaleTotalModel } from '../models/view.models/sale.total.model';
import { Purchase } from '../models/view.models/purchase.entity';
import { OrderDetailStates, PurchaseMethods, MenuItems } from '../models/enums';
import { User } from '../models/entities/user.entity';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpService: HttpService, private customerService: CustomerService) {
  }

  getCustomerInfo(customer: Customer, order: OrderViewModel): OrderCustomerInfoViewModel {
    const info = new OrderCustomerInfoViewModel();

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
      const item = new CustomerReceiverDetail();
      item.PhoneNumber = receiver.PhoneNumber;
      item.FullName = receiver.FullName;
      info.ReceiverInfos.push(item);
    });

    customer.SpecialDays.forEach(date => {
      const item = new SpecialDay();
      item.Date = date.Date;
      item.Description = date.Description;
      info.SpecialDays.push(item);
    });

    return info;
  }

  getOrderVMByRaw(order: any): OrderViewModel {

    const orderVM = new OrderViewModel();

    if (order == null) {
      return null;
    }

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
    orderVM.IsFinished = order.IsFinished;

    if (order.purchases) {

      order.purchases.forEach(purchase => {

        const purchaseEntity = new Purchase();

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

        const orderDetailVM = new OrderDetailViewModel();

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

            const shipper = new User();

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

            const making = new Making();

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

            const user = new User();

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

    const models: SaleTotalModel[] = [];

    orderVMs.forEach(orderVM => {
      const model = new SaleTotalModel();

      model.OrderId = orderVM.OrderId;
      model.CreatedDate = orderVM.CreatedDate;
      model.CustomerId = orderVM.CustomerInfo.Id;
      model.CustomerName = orderVM.CustomerInfo.Name;
      model.CustomerPhoneNumber = orderVM.CustomerInfo.PhoneNumber;
      model.AmountTotal = orderVM.TotalAmount;
      model.FeeTotal = 0;
      model.DiscountTotal = 0;
      model.PriceTotal = 0;
      model.TotalPaidAmount = orderVM.TotalPaidAmount;
      model.IsVATIncluded = orderVM.VATIncluded;

      orderVM.OrderDetails.forEach(orderDetail => {
        model.PriceTotal += orderDetail.ModifiedPrice;
        model.FeeTotal += orderDetail.AdditionalFee;
      });

      if (!orderVM.VATIncluded) {

        model.FinalTotal = model.AmountTotal;

      } else {

        model.FinalTotal = ExchangeService.getPreVATVal(model.AmountTotal);

      }

      // model.DiscountTotal = (model.PriceTotal + model.FeeTotal) - model.FinalTotal;

      models.push(model);

    });

    models.sort((a, b) => a.CreatedDate < b.CreatedDate ? -1 : a.CreatedDate > b.CreatedDate ? 1 : 0);

    return models;
  }

  finishOrders(ids: string[]): Promise<number> {
    return this.httpService.post(API_END_POINT.finishOrders, ids)
      .then(res => {

        return res.updatedCount;

      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  getSaleTotalByTimes(startTime: number, endTime: number, purchaseMethod: PurchaseMethods): Promise<SaleTotalModel[]> {
    return this.httpService.post(API_END_POINT.getOrderByDayRange, {
      startDate: startTime,
      endDate: endTime,
      purchaseMethod
    }).then(orders => {

      const orderVMs = this.getOrderVMsByRaw(orders.orders);
      return this.getSaleModels(orderVMs);

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getSaleTotalByYear(year: number, purchaseMethod: PurchaseMethods): Promise<SaleTotalModel[]> {

    const startTime = new Date();
    startTime.setFullYear(year, 0, 1);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date();
    endTime.setFullYear(year, 11, 31);
    endTime.setHours(23, 59, 59, 0);

    return this.getSaleTotalByTimes(startTime.getTime(), endTime.getTime(), purchaseMethod);
  }

  getSaleTotalByRange(times: number[], purchaseMethod: PurchaseMethods): Promise<SaleTotalModel[]> {

    const endDay = new Date(times[1]);
    endDay.setDate(endDay.getDate() + 1);

    return this.getSaleTotalByTimes(times[0], endDay.getTime(), purchaseMethod);

  }

  addScoreToCustomer(order: OrderViewModel): Promise<any> {

    const newMemberInfo = new MembershipInfo();

    const gainedScore = order.CustomerInfo.GainedScore;

    newMemberInfo.AvailableScore = order.CustomerInfo.AvailableScore - order.CustomerInfo.ScoreUsed + gainedScore;
    newMemberInfo.AccumulatedAmount = order.CustomerInfo.AccumulatedAmount + ExchangeService.getAmountFromScore(gainedScore);
    newMemberInfo.UsedScoreTotal = order.CustomerInfo.CustomerScoreUsedTotal + order.CustomerInfo.ScoreUsed;

    newMemberInfo.MembershipType = ExchangeService.detectMemberShipType(newMemberInfo.AccumulatedAmount);

    return this.customerService.updateFields(order.CustomerInfo.Id, {
      UsedScoreTotal: newMemberInfo.UsedScoreTotal,
      AvailableScore: newMemberInfo.AvailableScore,
      AccumulatedAmount: newMemberInfo.AccumulatedAmount,
      MembershipType: newMemberInfo.MembershipType,
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getOrderVMsByRaw(orders: any): OrderViewModel[] {

    const orderVMs: OrderViewModel[] = [];

    if (!orders || orders.length <= 0) {
      return [];
    }

    orders.forEach(order => {

      orderVMs.push(this.getOrderVMByRaw(order));

    });

    return orderVMs;

  }


  getDebtOrders(searchTerm: string, page: number, size: number, startTime: number, endTime: number): Promise<{
    orders: OrderViewModel[],
    totalItemCount: number,
    totalPages: number
  }> {

    return this.httpService.post(API_END_POINT.getDebts, {
      page: page - 1,
      size,
      startTime,
      endTime,
      searchTerm
    }).then(data => {

      const res: {
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
      id
    }).then(data => {

      if (data) {
        return this.getOrderVMByRaw(data.order);
      }

      return null;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }


  getSingleById(id: string): Promise<OrderViewModel> {
    return this.httpService.post(API_END_POINT.getOrderNotLazyById, {
      id
    }).then(data => {
      if (data) {
        return this.getOrderVMByRaw(data.order);
      }
      return null;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
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
      customerId
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
      term,
      page,
      size,
      statuses: statues
    }).then(data => {

      const res: {
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

  getMaxNumberId(year: number): Promise<number> {

    return this.httpService.post(API_END_POINT.getMaxOrderNumberId,
      {
        year
      })
      .then(data => {
        return data.max;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  deleteOrderDetailByOrderId(orderId: string, exceptImgNames: string[]): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteOrderDetailByOrderId, {
      orderId,
      exceptImgNames
    })
      .then(res => {
        return;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }


  deleteOrder(orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteOrder, {
      orderId
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  revertUsedScore(orderId: string): Promise<any> {
    return this.httpService.post(API_END_POINT.revertUsedScore, {
      orderId,
    })
      .then(res => {
        return res;
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
      orderDetails
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  updateOrderInfos(orderId: string, orderDetails: OrderDetail[], totalPaidAmount: number, customerId: string): Promise<any> {

    return this.httpService.post(API_END_POINT.updateOrderInfos, {
      orderDetails,
      orderId,
      totalPaidAmount,
      customerId
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
      doneTime: order.DoneTime,
      isFinished: order.IsFinished
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
