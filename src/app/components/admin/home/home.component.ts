import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, CusContactInfoTypes, MembershipTypes, OrderDetailStates, OrderType } from 'src/app/models/enums';
import { Guid } from 'guid-typescript';
import { ProductService } from 'src/app/services/product.service';
import { utils, WorkBook, WorkSheet, read, writeFile } from 'xlsx';
import { Customer, MembershipInfo } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { Order, OrderDetail } from 'src/app/models/entities/order.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { async } from '@angular/core/testing';
import { Product } from 'src/app/models/entities/product.entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  category: number = 0;

  constructor(private orderService: OrderService, private orderDetailService: OrderDetailService, private customerService: CustomerService, private router: Router, protected activatedRoute: ActivatedRoute, private productService: ProductService) {
    super();
  }

  protected Init() {

  }

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

  exportProducts() {
    this.productService.getAll().then(products => {

      let raw: string[][] = [];

      products.forEach(product => {

        let item: string[] = [];

        item.push(product.Product.Id.toString(), product.Product.Name, product.Product.Price.toString(), product.Product.ImageUrl);
        let tagVal = '';

        product.Tags.forEach(tag => {
          tagVal = tagVal + tag.Alias + ',';
        });

        item.push(tagVal);

        raw.push(item);

      });

      console.log(raw);

      /* generate worksheet */
      const ws: WorkSheet = utils.aoa_to_sheet(raw);
      /* generate workbook and add the worksheet */
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'produts');

      /* save to file */
      writeFile(wb, 'products.xlsx');

    });

  }

  onFileProductChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = (utils.sheet_to_json(ws, { header: 1 })) as string[][];

      let i = 1;
      let products: Product[] = [];

      while (i < data.length) {

        var row = data[i];

        if (!row[1] || row[1] == '')
          continue;

        let product = new Product();
        product.Name = row[1];
        product.Unit = row[2];
        product.Price = parseInt(row[3]);
        product.Description = '';
        product.ImageUrl = '';

        if (Number.isNaN(product.Price))
          product.Price = 0;

        products.push(product);

        i++;

      }

      console.log(products);

      console.log(this.category);

      this.productService.insertListWithOneCate(this.category, products)
        .then(() => {

        });

    }

    reader.readAsBinaryString(target.files[0]);

  }

  onFileOrderChange(evt: any) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = (utils.sheet_to_json(ws, { header: 1 })) as string[][];

      var orders: Order[] = [];
      var orderDetails: OrderDetail[] = [];

      this.startLoading();

      for (let i = 0; i < data.length; i++) {

        if (i == 0)
          continue;

        const row = data[i];
        let order = new Order();

        if (!row[0]) {
          continue;
        }

        if (row[1]) {

          order.Id = row[1].toString();

          order.Id = order.Id.replace('/', '-').replace('.', '_');

          if (order.Id.indexOf('_') > -1) {

            order.NumberId = -1;
            order.OrderType = OrderType.SpecialDay;

          } else {

            order.OrderType = OrderType.NormalDay;

            var int = parseInt(order.Id);

            if (int != undefined && int != undefined && int != NaN) {

              order.NumberId = int;

            } else {

              console.log('error id:', order.Id);

              order.NumberId = -1;
              order.OrderType = OrderType.SpecialDay;

            }

          }

        } else {
          order.Id = Guid.create().toString();
          order.NumberId = -1;
          order.OrderType = OrderType.SpecialDay;
        }

        order.CustomerId = row[0].toString();
        order.Created = ExchangeService.getTimeFromExcel(row[3]);
        order.TotalAmount = row[6] && row[6] != '' ? parseInt(row[6]) : 0;
        order.GainedScore = ExchangeService.getGainedScore(order.TotalAmount);
        order.TotalPaidAmount = order.TotalAmount;

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

        detail.ProductImageUrl = 'https://images.vexels.com/media/users/3/156051/isolated/preview/72094c4492bc9c334266dc3049c15252-flat-flower-icon-flower-by-vexels.png';
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
        TotalUsedScore: number,
        AvailableScore: number
      }[] = [];

      newOrders.forEach(order => {

        let cus = editCustomers.filter(p => p.Id == order.CustomerId);

        if (cus && cus.length > 0) {

          cus[0].TotalAmount += order.TotalAmount;
          cus[0].MemberType = ExchangeService.detectMemberShipType(cus[0].TotalAmount);
          console.log(cus[0].Id);
        }
        else {

          let currentCus = cuses.filter(p => p.Id == order.CustomerId);

          if (currentCus && currentCus.length > 0) {

            let memberInfo = currentCus[0].MembershipInfo ? currentCus[0].MembershipInfo : new MembershipInfo();

            editCustomers.push({
              Id: order.CustomerId,
              TotalAmount: order.TotalAmount,
              MemberType: ExchangeService.detectMemberShipType(order.TotalAmount),
              TotalUsedScore: memberInfo.UsedScoreTotal,
              AvailableScore: 0
            });

          }

        }

      });

      editCustomers.forEach(cus => {
        cus.AvailableScore = ExchangeService.getGainedScore(cus.TotalAmount) - cus.TotalUsedScore;
      });

      console.log(editCustomers);

      var i, j, chunk = 50;
      let temparray = [];

      for (i = 0, j = editCustomers.length; i < j; i += chunk) {

        temparray = editCustomers.slice(i, i + chunk);

        let update = await this.customerService.updateList(temparray);

        console.log(update);

      }

      console.log('------------------------------');

      let prodArray: Order[] = [];

      for (i = 0, j = newOrders.length; i < j; i += chunk) {

        prodArray = newOrders.slice(i, i + chunk);

        let update = await this.orderService.addBulk(prodArray);

        console.log(update);

      }

      console.log('------------------------------');

      let orderDetailArray: OrderDetail[] = [];

      for (i = 0, j = orderDetails.length; i < j; i += chunk) {

        orderDetailArray = orderDetails.slice(i, i + chunk);

        let update = await this.orderService.addOrderDetails(orderDetailArray);

        console.log(update);

      }

      this.stopLoading();

    }

    reader.readAsBinaryString(target.files[0]);
  }

  onFileChange(evt: any) { // customer
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = (utils.sheet_to_json(ws, { header: 1 })) as string[][];

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
