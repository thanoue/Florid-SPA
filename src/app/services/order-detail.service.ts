import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { ODSeenUserInfo, OrderDetail } from '../models/entities/order.entity';
import { OrderDetailStates } from '../models/enums';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { OrderDetailViewModel } from '../models/view.models/order.model';
import { User } from '../models/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private httpService: HttpService, private globalService: GlobalService) {
  }

  updateFields(id: number, value: any): Promise<any> {
    return this.httpService.post(API_END_POINT.updateODFields, {
      obj: value,
      orderDetailId: +id
    }).then(res => {
      return res.result;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getNextMakingSortOrder(): Promise<number> {

    return this.httpService.get(API_END_POINT.getMaxMakingSortOrder)
      .then(value => {

        return value.maxMakingSortOrder + 1;

      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });

  }

  resultConfirm(orderDetailId: number, resultImg: File): Promise<any> {

    return this.httpService.postForm(API_END_POINT.resultConfirm, {
      orderDetailId: orderDetailId,
      resultImg: resultImg
    }).then(obj => {

      return obj;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });
  }

  shippingConfirm(orderDetailId: number, shippingImg: File, note: string): Promise<any> {

    return this.httpService.postForm(API_END_POINT.shippingConfirm, {
      orderDetailId: orderDetailId,
      shippingImg: shippingImg,
      deliveryCompletedTime: (new Date()).getTime(),
      note: note
    }).then(obj => {

      return obj;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });
  }

  getNextShippingSortOrder(): Promise<number> {

    return this.httpService.get(API_END_POINT.getMaxShippingSortOrder)
      .then(value => {

        return value.maxShippingSortOrder + 1;

      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });

  }

  updateMakingSortOrders(data: any): Promise<any> {
    return this.httpService.post(API_END_POINT.updateMakingSortOrder, {
      details: data
    })
      .then(value => {

        return value;

      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  updateShippingSortOrders(data: any): Promise<any> {
    return this.httpService.post(API_END_POINT.updateShippingSortOrder, {
      details: data
    })
      .then(value => {

        return value;

      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  getFromRaw(orderDetail: any): OrderDetailViewModel {
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
    orderDetailVM.MakingRequestTime = orderDetail.MakingRequestTime;
    orderDetailVM.DeliveryCompletedTime = orderDetail.DeliveryCompletedTime;
    orderDetailVM.ShippingSessionId = orderDetail.ShippingSessionId;
    orderDetailVM.MakingStartTime = orderDetail.MakingStartTime;
    orderDetailVM.MakingCompletedTime = orderDetail.MakingCompletedTime;
    orderDetailVM.ResultImageUrl = orderDetail.ResultImageUrl;
    orderDetailVM.DeliveryImageUrl = orderDetail.DeliveryImageUrl;
    orderDetailVM.MakingNote = orderDetail.MakingNote;


    return orderDetailVM;
  }

  getByState(state: OrderDetailStates): Promise<OrderDetailViewModel[]> {
    return this.getByStates([state]);
  }

  getByStates(states: OrderDetailStates[]): Promise<OrderDetailViewModel[]> {

    return this.httpService.post(API_END_POINT.getOrderDetailByStates, {
      states: states
    }).then(data => {
      let orderDetailVMs: OrderDetailViewModel[] = [];

      if (data == null || data.orderDetails == null)
        return [];

      data.orderDetails.forEach(orderDetail => {

        orderDetailVMs.push(this.getFromRaw(orderDetail));

      });

      return orderDetailVMs;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getByOrderId(orderId: string): Promise<OrderDetailViewModel[]> {
    return this.httpService.post(API_END_POINT.getOrderDetailsByOrderId, {
      orderId: orderId
    }).then(data => {

      let orderDetailVMs: OrderDetailViewModel[] = [];

      if (data == null || data.orderDetails == null)
        return [];

      data.orderDetails.forEach(orderDetail => {

        orderDetailVMs.push(this.getFromRaw(orderDetail));

      });

      return orderDetailVMs;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  assignSingleOD(orderDetailId: number, shipperId: number, assignTime: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignSingleOD, {
      orderDetailId: orderDetailId,
      shipperId: shipperId,
      assignTime: assignTime
    }).then(data => {
      return data;
    })
  }

  assignOrderDetails(orderDetailIds: number[], shipperId: number, assignTime: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignOrderDetails, {
      orderDetailIds: orderDetailIds,
      shipperId: shipperId,
      assignTime: assignTime
    }).then(data => {
      return data;
    })
  }

  getByStateAndFloristId(floristId: number, state: OrderDetailStates): Promise<OrderDetailViewModel[]> {
    return this.getByStatesAndFloristId(floristId, [state]);
  }

  getByStatesAndFloristId(floristId: number, states: OrderDetailStates[]): Promise<OrderDetailViewModel[]> {
    return this.httpService.post(API_END_POINT.getOrderDetailByStatesAndFloristId, {
      states: states,
      floristId: floristId
    }).then(data => {
      let orderDetailVMs: OrderDetailViewModel[] = [];

      data.orderDetails.forEach(orderDetail => {

        orderDetailVMs.push(this.getFromRaw(orderDetail));

      });

      return orderDetailVMs;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getShippingOrderDetails(shipperId: number): Promise<OrderDetailViewModel[]> {

    return this.httpService.post(API_END_POINT.getShippingOrderDetails, {
      shipperId: shipperId
    }).then(data => {

      let orderDetailVMs: OrderDetailViewModel[] = [];

      console.log(data);

      if (data == null || data.length <= 0)
        return [];

      data.forEach(item => {
        orderDetailVMs.push(this.getFromRaw(item.orderDetail));
      });

      return orderDetailVMs;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  updateDetailSeen(orderDetailId: number, userId: number, seenTime: number, isAnim: boolean = true): Promise<any> {
    return this.httpService.post(API_END_POINT.updateDetailSeen, {
      userId: userId,
      orderDetailId: orderDetailId,
      seenTime: seenTime
    }, isAnim).then(data => {

      return data;
    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });
  }

  getODFlorisAndShipper(orderDetailId: number): Promise<{
    Florist: any,
    Shipper: any,
    FixingFlorist: any
  }> {

    return this.httpService.post(API_END_POINT.getOrderDetailShipperAndFlorist, {
      orderDetailId: orderDetailId
    }).then(data => {

      return {
        Florist: data.florist,
        Shipper: data.shipper,
        FixingFlorist: data.fixingFlorist
      };

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });

  }

  getODSeeners(orderDetailId: number): Promise<ODSeenUserInfo[]> {
    return this.httpService.post(API_END_POINT.getODSeeners, {
      orderDetailId: orderDetailId
    }).then(data => {

      let users: ODSeenUserInfo[] = [];

      if (data && data != null && data.seeners.length > 0) {
        data.seeners.forEach(seenTime => {

          users.push({
            FullName: seenTime.user ? seenTime.user.FullName : '',
            UserId: seenTime.user ? seenTime.user.Id : 0,
            Role: seenTime.user && seenTime.user.roles ? seenTime.user.roles[0].Name : '',
            SeenTime: seenTime.SeenTime ? seenTime.SeenTime : 0,
            Avt: seenTime.user ? seenTime.user.AvtUrl : ''
          });

        });

      }

      return users;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });
  }

}
