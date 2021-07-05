import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { ODSeenUserInfo, OrderDetail, Shipping, Making } from '../models/entities/order.entity';
import { OrderDetailStates, MakingType } from '../models/enums';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { OrderDetailViewModel, OrderViewModel } from '../models/view.models/order.model';
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

  updateStatusByOrderId(orderId: string, status: OrderDetailStates): Promise<any> {
    return this.httpService.post(API_END_POINT.updateStatusByOrderId, {
      orderId: orderId,
      status: status,
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }


  resultConfirm(orderDetailId: number, makingId: number, resultImg: File): Promise<any> {

    return this.httpService.postForm(API_END_POINT.resultConfirm, {
      orderDetailId: orderDetailId,
      resultImg: resultImg,
      makingId: makingId
    }).then(obj => {

      return obj;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });
  }

  shippingConfirm(orderDetail: OrderDetailViewModel, shippingImg: File, note: string): Promise<any> {

    let lastestShipping = this.getLastestShipping(orderDetail);

    return this.httpService.postForm(API_END_POINT.shippingConfirm, {
      shippingId: lastestShipping.Id,
      shippingImg: shippingImg,
      orderrDetailId: orderDetail.OrderDetailId,
      deliveryCompletedTime: (new Date()).getTime(),
      note: note
    }).then(obj => {

      return obj;

    }).catch(err => {

      this.httpService.handleError(err);
      throw err;

    });

  }


  getFromRaw(orderDetail: any): OrderDetailViewModel {

    let orderDetailVM = new OrderDetailViewModel();

    orderDetailVM.ProductName = orderDetail.ProductName;
    orderDetailVM.OrderId = orderDetail.OrderId;
    orderDetailVM.OrderDetailId = orderDetail.Id;
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
    orderDetailVM.CustomerPhoneNumber = orderDetail.CustomerPhoneNumber;
    orderDetailVM.HardcodeImageName = orderDetail.HardcodeImageName;
    orderDetailVM.PercentDiscount = orderDetail.PercentDiscount;
    orderDetailVM.AmountDiscount = orderDetail.AmountDiscount;
    orderDetailVM.MakingRequestTime = orderDetail.MakingRequestTime;
    orderDetailVM.ShippingNote = orderDetail.ShippingNote;
    orderDetailVM.Quantity = orderDetail.Quantity ? orderDetail.Quantity : 1;
    orderDetailVM.MakingNote = orderDetail.MakingNote;

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
        shipping.OrderDetailId = orderDetailVM.OrderDetailId;
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
        making.OrderDetailId = orderDetailVM.OrderDetailId;
        making.MakingType = rawMaking.MakingType;


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

    return orderDetailVM;
  }

  getByState(state: OrderDetailStates, orderColumn: string, direction: string = 'ASC'): Promise<OrderDetailViewModel[]> {
    return this.getByStates([state], orderColumn, direction);
  }

  getByStates(states: OrderDetailStates[], orderColumn: string, direction: string = 'ASC'): Promise<OrderDetailViewModel[]> {

    return this.httpService.post(API_END_POINT.getOrderDetailByStates, {
      states: states,
      orderColumn: orderColumn,
      direction: direction
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

  assignSingleMaking(orderDetailId: number, floristId: number, assignTime: number, makingType: MakingType): Promise<any> {
    return this.httpService.post(API_END_POINT.assignSingleMaking, {
      orderDetailId: orderDetailId,
      floristId: floristId,
      assignTime: assignTime,
      makingType: makingType
    }).then(data => {
      return data;
    })
  }

  assignSingleOD(orderDetailId: number, shipperId: number, assignTime: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignSingleOD, {
      orderDetailId: orderDetailId,
      shipperId: shipperId,
      assignTime: assignTime,
    }).then(data => {
      return data;
    })
  }

  replaceShipper(orderDetailId: number, oldShippingId: number, newShipperId: number = -1) {

    return this.httpService.post(API_END_POINT.replaceShipper, {
      orderDetailId: orderDetailId,
      newShipperId: newShipperId,
      oldShippingId: oldShippingId,
      newAssignTime: new Date().getTime()
    }).then(data => {
      return data;
    });

  }

  replaceFlorist(orderDetailId: number, oldMakingId: number, newFloristId: number = -1) {

    return this.httpService.post(API_END_POINT.replaceShipper, {
      orderDetailId: orderDetailId,
      newFloristId: newFloristId,
      oldMakingId: oldMakingId,
      newAssignTime: new Date().getTime()
    }).then(data => {
      return data;
    });

  }

  updateShippingFields(shippingId: number, obj: any): Promise<any> {

    return this.httpService.post(API_END_POINT.updateShippingFields, {
      obj: obj,
      id: shippingId
    }).then(data => {
      return data
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  updateMakingFields(makingId: number, obj: any): Promise<any> {

    return this.httpService.post(API_END_POINT.updateMakingFields, {
      obj: obj,
      id: makingId
    }).then(data => {
      return data
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }


  assignOrderDetails(orderDetailIds: number[], shipperId: number, assignTime: number): Promise<any> {
    return this.httpService.post(API_END_POINT.assignOrderDetails, {
      orderDetailIds: orderDetailIds,
      shipperId: shipperId,
      assignTime: assignTime
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  assignFloristForOrderDetails(orderDetailIds: OrderDetailViewModel[], floristdId: number, assignTime: number): Promise<any> {

    let makings: any[] = [];

    orderDetailIds.forEach(orderDetail => {

      let making: { AssignTime: number, FloristId: number, MakingType: MakingType, OrderDetailId: number } = {
        AssignTime: assignTime,
        FloristId: floristdId,
        MakingType: orderDetail.State == OrderDetailStates.FixingRequest ? MakingType.Fixing : MakingType.Making,
        OrderDetailId: orderDetail.OrderDetailId
      };

      makings.push(making);

    });

    return this.httpService.post(API_END_POINT.assignFloristForOrderDetails, {
      makings: makings,
    }).then(data => {
      return data;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
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

      if (data == null || data.length <= 0)
        return [];

      data.forEach(item => {
        orderDetailVMs.push(this.getFromRaw(item));
      });

      return orderDetailVMs;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

    getMakingOrderDetails(floristId: number): Promise<OrderDetailViewModel[]> {

    return this.httpService.post(API_END_POINT.getMakingWaitOrderDetails, {
      floristId: floristId
    }).then(data => {

      let orderDetailVMs: OrderDetailViewModel[] = [];

      if (data == null || data.length <= 0)
        return [];

      data.forEach(item => {
        orderDetailVMs.push(this.getFromRaw(item));
      });

      return orderDetailVMs;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });

  }

  getLastestMaking(orderDetail: OrderDetailViewModel): Making {

    if (!orderDetail.Makings || orderDetail.Makings.length <= 0) {
      return new Making();
    }

    let making = new Making();
    making.AssignTime = 0;

    orderDetail.Makings.forEach(raw => {
      if (raw.AssignTime > making.AssignTime) {
        making = raw;
      }
    });

    return making;

  }

  getLastestShipping(orderDetail: OrderDetailViewModel): Shipping {

    if (!orderDetail.Shippings || orderDetail.Shippings.length <= 0) {
      return new Shipping();
    }

    let shipping = new Shipping();
    shipping.AssignTime = 0;

    orderDetail.Shippings.forEach(raw => {
      if (raw.AssignTime > shipping.AssignTime) {
        shipping = raw;
      }
    });

    return shipping;

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
