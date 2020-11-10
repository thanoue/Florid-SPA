import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, CusContactInfoTypes, MembershipTypes, OrderDetailStates } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';
import { Guid } from 'guid-typescript';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import * as XLSX from 'xlsx';
import { isatty } from 'tty';
import { single } from 'rxjs/operators';
import { Customer, MembershipInfo } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { Order, OrderDetail } from 'src/app/models/entities/order.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { info } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  constructor(private orderService: OrderService, private orderDetailService: OrderDetailService, private customerService: CustomerService, private router: Router, protected activatedRoute: ActivatedRoute, private productService: ProductService) {
    super();
  }

  protected Init() {

  }

  // onFileChange(evt: any) {

  //   /* wire up file reader */
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   const reader: FileReader = new FileReader();
  //   reader.onload = (e: any) => {
  //     /* read workbook */
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //     /* grab first sheet */
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //     /* save data */
  //     let data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as string[][];

  //     var orders: Order[] = [];
  //     var orderDetails: OrderDetail[] = [];

  //     this.startLoading();

  //     this.productService.getAll()
  //       .then(products => {

  //         for (let i = 0; i < data.length; i++) {

  //           if (i == 0)
  //             continue;

  //           const row = data[i];
  //           const order = new Order();

  //           if (!row[0])
  //             break;

  //           var lines = row[0].split(/\r?\n/g);

  //           console.log(lines);

  //         };

  //         this.orderDetailService.setList(orderDetails)
  //           .then(() => {
  //             this.stopLoading();
  //           });

  //         this.orderService.setList(orders)
  //           .then(() => {
  //             this.stopLoading();
  //           });

  //       });
  //   }

  //   reader.readAsBinaryString(target.files[0]);

  // }

  getNumFromString(src: string): string {

    let numSrc = '';

    if (src == '')
      return '';

    for (let i = 0; i < src.length; i++) {

      let char = src[i];

      if (char == '')
        continue;

      let num = parseInt(char);

      if (num >= 0 && num <= 9)
        numSrc += char;
    }

    return numSrc;

  }

  onFileOrderChange(evt: any) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as string[][];

      var orders: Order[] = [];
      var orderDetails: OrderDetail[] = [];

      this.startLoading();

      for (let i = 0; i < data.length; i++) {

        if (i == 0)
          continue;

        const row = data[i];
        const order = new Order();

        if (!row[0]) {
          continue;
        }

        order.CustomerId = row[0].toString();
        order.Id = row[1] ? row[1].toString() : Guid.create().toString();
        order.Created = ExchangeService.getTimeFromExcel(row[3]);
        order.TotalAmount = row[6] && row[6] != '' ? parseInt(row[6]) : 0;
        order.GainedScore = ExchangeService.getGainedScore(order.TotalAmount);
        order.TotalPaidAmount = order.TotalAmount;

        order.Id = order.Id.replace('/', '-').replace('.', '_');

        let duplicates = orders.filter(p => p.Id == order.Id && p.CustomerId != order.CustomerId);

        if (duplicates && duplicates.length > 0) {
          order.Id += "_";
        }

        var detail = new OrderDetail();

        detail.TotalAmount = order.TotalAmount;
        detail.OrderId = order.Id;
        detail.PurposeOf = row[4] ? row[4] : '';
        detail.State = OrderDetailStates.Completed;
        detail.ProductModifiedPrice = row[5] ? parseInt(row[5]) : 0;

        detail.ProductName = row[2] ? row[2] : '';

        detail.ProductImageUrl = 'https://firebasestorage.googleapis.com/v0/b/lorid-e9c34.appspot.com/o/products%2FLOGO%20FLORID.png?alt=media&token=be8bd572-4e06-44ba-aa3e-0a709c3e519c';
        detail.IsHardcodeProduct = true;
        detail.ProductPrice = detail.ProductModifiedPrice;

        orderDetails.push(detail);
        orders.push(order);

      };

      let newOrders: Order[] = [];

      orders.forEach(order => {

        let duplicates = newOrders.filter(p => p.CustomerId == order.CustomerId && p.Id == order.Id);

        if (duplicates && duplicates[0]) {

          duplicates[0].TotalAmount += order.TotalAmount;
          duplicates[0].TotalPaidAmount += order.TotalPaidAmount;
          duplicates[0].GainedScore += ExchangeService.getGainedScore(duplicates[0].TotalAmount);

        }
        else {
          newOrders.push(order);
        }

      });

      let cuses = await this.customerService.getAll();

      let editCustomers: {
        Id: string,
        TotalAmount: number,
        MemberType: MembershipTypes,
        TotalUsedScore: number
      }[] = [];

      console.log(newOrders);
      console.log(orderDetails);

      newOrders.forEach(order => {

        let cus = editCustomers.filter(p => p.Id == order.CustomerId);

        if (cus && cus.length > 0) {

          cus[0].TotalAmount += order.TotalAmount;
          cus[0].MemberType = ExchangeService.detectMemberShipType(cus[0].TotalAmount);

        }
        else {

          let currentCus = cuses.filter(p => p.Id == order.CustomerId);

          if (currentCus && currentCus.length > 0) {

            let memberInfo = currentCus[0].MembershipInfo ? currentCus[0].MembershipInfo : new MembershipInfo();

            editCustomers.push({
              Id: order.CustomerId,
              TotalAmount: order.TotalAmount,
              MemberType: memberInfo.MembershipType,
              TotalUsedScore: memberInfo.UsedScoreTotal
            });

          }

        }

      });

      console.log(editCustomers);

    }

  }

  onFileChange(evt: any) { // customer
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as string[][];

      var customers: Customer[] = [];

      let count = 0;

      data.forEach(row => {

        if (count > 0) {

          // if (count == 1)
          //   count = 448;

          let customer = new Customer();

          customer.Id = row[0];

          if (!customer.Id || customer.Id == undefined)
            return;

          if (!row[1] || row[1] == '' || row[1].toLowerCase() == 'anh') {
            customer.Sex = Sexes.Male;
          } else {
            customer.Sex = Sexes.Female;
          }

          customer.FullName = row[2] ? row[2] : '';

          customer.ContactInfo.Facebook = row[3] ? row[3] : '';

          customer.MainContactInfo = CusContactInfoTypes.Facebook;

          customer.Birthday = ExchangeService.getTimeFromExcel(row[4]);

          customer.PhoneNumber = row[5] ? row[5].toString() : '';

          if (row[6] && row[6] != '') {

            let zaloViber = row[6].toString();

            if (zaloViber.toLowerCase().indexOf('zalo') > -1) {

              customer.ContactInfo.Zalo = zaloViber.replace('Zalo ', '').replace('zalo ', '');

            } else {

              customer.ContactInfo.Zalo = zaloViber;
              customer.ContactInfo.Skype = zaloViber;
              customer.ContactInfo.Viber = zaloViber;
              customer.ContactInfo.Instagram = zaloViber;

            }

            customer.MainContactInfo = CusContactInfoTypes.Zalo;

          }

          customer.Address.Home = row[8] ? row[8] : '';
          customer.Address.Work = row[9] ? row[9] : '';

          let memberInfo = new MembershipInfo();

          memberInfo.AccumulatedAmount = row[10] && row[10] != '' ? parseInt(row[10]) : 0;
          memberInfo.UsedScoreTotal = row[13] && row[13] != '' ? parseInt(row[13]) : 0;
          memberInfo.AvailableScore = row[14] && row[114] != '' ? parseFloat(row[14]) : 0;
          memberInfo.MembershipType = ExchangeService.detectMemberShipType(memberInfo.AccumulatedAmount);

          customer.MembershipInfo = memberInfo;

          customers.push(customer);

        }

        count += 1;

      });

      console.log(customers);

      //this.startLoading();
      this.customerService.createCustomers(customers).then(() => {
        this.stopLoading();
      });

    };

    reader.readAsBinaryString(target.files[0]);
  }


  goToPrintJob() {
  }


}
