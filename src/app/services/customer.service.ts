import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer, CustomerAddress, CustomerContactInfo, MembershipInfo, SpecialDay } from '../models/entities/customer.entity';
import { CustomerReceiverDetail } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';
import { Product } from '../models/entities/product.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpService: HttpService, private globalService: GlobalService) {

  }

  updateFields(id: string, obj: any): Promise<any> {
    return this.httpService.post(API_END_POINT.updateCustomerFields, {
      customerId: id,
      obj: obj
    }).then(res => {
      console.log(res);
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getById(id: string): Promise<Customer> {
    return this.httpService.get(API_END_POINT.getCustomeById, {
      id: id
    }).then(data => {

      let item = data.customer;

      let customer = new Customer();

      customer.Id = item.Id;
      customer.FullName = item.FullName;
      customer.PhoneNumber = item.PhoneNumber;
      customer.Birthday = item.Birthday;
      customer.Sex = item.Sex;

      customer.Address = new CustomerAddress();
      customer.Address.Work = item.WorkAddress;
      customer.Address.Home = item.HomeAddress;

      customer.ContactInfo = new CustomerContactInfo();
      customer.ContactInfo.Facebook = item.ContactInfo_Facebook;
      customer.ContactInfo.Zalo = item.ContactInfo_Zalo;
      customer.ContactInfo.Skype = item.ContactInfo_Skype;
      customer.ContactInfo.Viber = item.ContactInfo_Viber;
      customer.ContactInfo.Instagram = item.ContactInfo_Instagram;

      customer.MainContactInfo = item.MainContactInfo;

      customer.MembershipInfo = new MembershipInfo();
      customer.MembershipInfo.AccumulatedAmount = item.AccumulatedAmount;
      customer.MembershipInfo.UsedScoreTotal = item.UsedScoreTotal;
      customer.MembershipInfo.AvailableScore = item.AvailableScore;
      customer.MembershipInfo.MembershipType = item.MembershipType;

      customer.ReceiverInfos = [];
      customer.SpecialDays = [];

      item.customerReceivers.forEach(receiver => {
        let item = new CustomerReceiverDetail();
        item.PhoneNumber = receiver.PhoneNumber;
        item.FullName = receiver.FullName;
        customer.ReceiverInfos.push(item);
      });

      item.customerSpecialDays.forEach(date => {
        let item = new SpecialDay();
        item.Date = date.Date;
        item.Description = date.Description;
        customer.SpecialDays.push(item);
      });

      return customer;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  updateReceiverList(customerId: string, receiverDetails: CustomerReceiverDetail[]): Promise<any> {

    return this.httpService.post(API_END_POINT.updateReciverInfo, {
      customerId: customerId,
      receiverList: receiverDetails
    }).then(res => {
      return res;
    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  getCount(): Promise<number> {
    return this.httpService.get(API_END_POINT.getCustomeCount)
      .then(data => {
        return data.count;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  updateCustomer(customer: Customer): Promise<any> {

    let specialdays = [];

    if (customer.SpecialDays) {
      customer.SpecialDays.forEach(specialDay => {
        specialdays.push({
          date: specialDay.Date,
          description: specialDay.Description
        });
      })
    }

    return this.httpService.post(API_END_POINT.updateCustomer, {
      fullName: customer.FullName,
      phoneNumber: customer.PhoneNumber,
      birthday: customer.Birthday,
      sex: customer.Sex,
      usedScoreTotal: customer.MembershipInfo.UsedScoreTotal,
      availableScore: customer.MembershipInfo.AvailableScore,
      accumulatedAmount: customer.MembershipInfo.AccumulatedAmount,
      membershipType: customer.MembershipInfo.MembershipType,
      facebook: customer.ContactInfo.Facebook,
      zalo: customer.ContactInfo.Zalo,
      skype: customer.ContactInfo.Skype,
      viber: customer.ContactInfo.Viber,
      instagram: customer.ContactInfo.Instagram,
      mainContactInfo: customer.MainContactInfo,
      id: customer.Id,
      specialDays: specialdays,
      workAddress: customer.Address.Work,
      homeAddress: customer.Address.Home
    })
      .then(() => {
        return;
      })
      .catch(err => {
        this.httpService.handleError(err);
        throw err;
      })

  }

  createCustomer(customer: Customer): Promise<any> {
    return this.httpService.post(API_END_POINT.createCustomer, {
      fullName: customer.FullName,
      phoneNumber: customer.PhoneNumber,
      birthday: customer.Birthday,
      sex: customer.Sex,
      usedScoreTotal: customer.MembershipInfo.UsedScoreTotal,
      availableScore: customer.MembershipInfo.AvailableScore,
      accumulatedAmount: customer.MembershipInfo.AccumulatedAmount,
      membershipType: customer.MembershipInfo.MembershipType,
      facebook: customer.ContactInfo.Facebook,
      zalo: customer.ContactInfo.Zalo,
      skype: customer.ContactInfo.Skype,
      viber: customer.ContactInfo.Viber,
      instagram: customer.ContactInfo.Instagram,
      mainContactInfo: customer.MainContactInfo,
      id: customer.Id
    }).then((customer) => {
      return customer;
    })
      .catch(err => {
        this.httpService.handleError(err);
      })
  }

  delete(id: string): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteCustomer, {
      id: id
    }).then(() => {
      return;
    }).catch((err) => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  deleteMany(ids: string[]): Promise<any> {
    return this.httpService.post(API_END_POINT.deleteManyCustomer, {
      ids: ids
    }).then(() => {
      return;
    }).catch((err) => {
      this.httpService.handleError(err);
      throw err;
    });
  }

  private getCustomerFromRaw(items: any[]): Customer[] {

    let customers = [];

    items.forEach(item => {

      let customer = new Customer();

      customer.Id = item.Id;
      customer.FullName = item.FullName;
      customer.PhoneNumber = item.PhoneNumber;
      customer.Birthday = item.Birthday;
      customer.Sex = item.Sex;

      customer.Address = new CustomerAddress();
      customer.Address.Work = item.WorkAddress;
      customer.Address.Home = item.HomeAddress;

      customer.ContactInfo = new CustomerContactInfo();
      customer.ContactInfo.Facebook = item.ContactInfo_Facebook;
      customer.ContactInfo.Zalo = item.ContactInfo_Zalo;
      customer.ContactInfo.Skype = item.ContactInfo_Skype;
      customer.ContactInfo.Viber = item.ContactInfo_Viber;
      customer.ContactInfo.Instagram = item.ContactInfo_Instagram;

      customer.MainContactInfo = item.MainContactInfo;

      customer.MembershipInfo = new MembershipInfo();
      customer.MembershipInfo.AccumulatedAmount = item.AccumulatedAmount;
      customer.MembershipInfo.UsedScoreTotal = item.UsedScoreTotal;
      customer.MembershipInfo.AvailableScore = item.AvailableScore;
      customer.MembershipInfo.MembershipType = item.MembershipType;

      customer.ReceiverInfos = [];
      customer.SpecialDays = [];

      if (item.customerReceivers && item.customerReceivers.length > 0) {

        item.customerReceivers.forEach(receiver => {

          let item = new CustomerReceiverDetail();
          item.PhoneNumber = receiver.PhoneNumber;
          item.FullName = receiver.FullName;

          customer.ReceiverInfos.push(item);
        });
      }

      if (item.customerSpecialDays && item.customerSpecialDays.length > 0) {
        item.customerSpecialDays.forEach(date => {
          let item = new SpecialDay();
          item.Date = date.Date;
          item.Description = date.Description;
          customer.SpecialDays.push(item);
        });
      }

      customers.push(customer);

    });

    return customers;
  }

  getAll(): Promise<Customer[]> {

    return this.httpService.get(API_END_POINT.getAllCustomer)
      .then(data => {
        return this.getCustomerFromRaw(data.customers);
      }).catch(err => {
        this.httpService.handleError(err);
        throw err;
      });
  }

  getList(page: number, itemsPerPage: number, term: string = ''): Promise<{
    Customers: Customer[],
    totalItemCount: number,
    totalPages: number
  }> {
    return this.httpService.get(API_END_POINT.getCustomers, {
      page: page - 1,
      size: itemsPerPage,
      term: term
    }).then(data => {

      let res: {
        Customers: Customer[],
        totalItemCount: number,
        totalPages: number
      } = {
        totalItemCount: 0,
        totalPages: 0,
        Customers: []
      };

      res.totalItemCount = data.totalItemCount;
      res.totalPages = data.totalPages;
      res.Customers = this.getCustomerFromRaw(data.items);

      return res;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }


}