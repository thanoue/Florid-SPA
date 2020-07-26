import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer, CustomerAddress, CustomerContactInfo, MembershipInfo, SpecialDay } from '../models/entities/customer.entity';
import * as firebase from 'firebase';
import { CustomerReceiverDetail } from '../models/entities/order.entity';
import { HttpService } from './common/http.service';
import { GlobalService } from './common/global.service';
import { API_END_POINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  updateSingleField(Id: string, arg1: string, currentReceiver: CustomerReceiverDetail) {
    throw new Error("Method not implemented.");
  }


  constructor(private httpService: HttpService, private globalService: GlobalService) {

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
    });;
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

  createCustomer(customer: Customer): Promise<any> {
    console.log(customer);
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

      data.items.forEach(item => {

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
        });

        res.Customers.push(customer);
      });

      return res;

    }).catch(err => {
      this.httpService.handleError(err);
      throw err;
    });
  }

}