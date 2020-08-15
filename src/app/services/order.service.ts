import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order, OrderDetail, CustomerReceiverDetail } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { promise } from 'protractor';
import { OrderViewModel, OrderCustomerInfoViewModel, OrderDetailViewModel } from '../models/view.models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private httpService: HttpService, private globalService: GlobalService) {
  }

  getOrderVMsByRaw(orders: any): OrderViewModel[] {

    let orderVMs: OrderViewModel[] = [];

    if (!orders || orders.length <= 0)
      return [];

    orders.forEach(order => {

      let orderVM = new OrderViewModel();

      orderVM.OrderId = order.Id;
      orderVM.TotalAmount = order.TotalAmount;
      orderVM.TotalPaidAmount = order.TotalPaidAmount;
      orderVM.CreatedDate = order.CreatedDate;
      orderVM.VATIncluded = order.VATIncluded;
      orderVM.OrderType = order.OrderType;

      orderVM.CustomerInfo = new OrderCustomerInfoViewModel();

      if (order.orderDetails && order.orderDetails.length > 0) {
        orderVM.CustomerInfo.Name = order.orderDetails[0].CustomerName;
        orderVM.CustomerInfo.PhoneNumber = order.orderDetails[0].CustomerPhoneNumber;
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
        orderDetailVM.DeliveryInfo.DateTime = orderDetail.ReceivingTime;
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

        orderVM.OrderDetails.push(orderDetailVM);

      });

      orderVMs.push(orderVM);

    });

    return orderVMs;
  }

  getOrderViewModelsByCusId(customerId: string): Promise<OrderViewModel[]> {
    return this.httpService.post(API_END_POINT.getOrdersByCustomerId, {
      customerId: customerId
    }).then(orders => {
      return this.getOrderVMsByRaw(orders.orders);
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });;
  }

  getOrderViewModelsByStates(states: string[]): Promise<OrderViewModel[]> {
    return this.httpService.post(API_END_POINT.getOrdersByStates, {
      states: states
    }).then(orders => {
      console.log(orders);
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

  addOrder(order: Order): Promise<Order> {
    return this.httpService.post(API_END_POINT.addOrder, {
      customerId: order.CustomerId,
      id: order.Id,
      vatIncluded: order.VATIncluded,
      totalAmount: order.TotalAmount,
      totalPaidAmount: order.TotalPaidAmount,
      gaindedScore: order.GainedScore,
      scoreUsed: order.ScoreUsed,
      orderType: order.OrderType,
      createdDate: order.Created
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
