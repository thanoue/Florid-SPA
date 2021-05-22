import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, CusContactInfoTypes, MembershipTypes, OrderDetailStates, OrderType, PurchaseMethods } from 'src/app/models/enums';
import { Guid } from 'guid-typescript';
import { ProductService } from 'src/app/services/product.service';
import { utils, WorkBook, WorkSheet, read, writeFile } from 'xlsx';
import { Customer, MembershipInfo } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { Order, OrderDetail } from 'src/app/models/entities/order.entity';
import { ExchangeService } from 'src/app/services/common/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { async } from '@angular/core/testing';
import { Product } from 'src/app/models/entities/product.entity';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { PurchaseService } from 'src/app/services/purchase.service';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/entities/tag.entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  category: number = 0;

  constructor(private orderService: OrderService, private tagService: TagService, private purchaseService: PurchaseService, private orderDetailService: OrderDetailService, private customerService: CustomerService, private router: Router, protected activatedRoute: ActivatedRoute, private productService: ProductService) {
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

  detectPrice(src: any): number {

    if (!src || src == '')
      return 0;

    if (!Number.isNaN(src)) {

      src = src.toString();

    }

    if (src.indexOf('đ', 0) > -1) {

      src = src.trim().split(' ')[0].trim();

    }

    let parts = src.split('.');

    let dest = '';

    parts.forEach(part => {
      dest += part;
    });

    if (dest == '') {
      console.log(src);
    }

    return parseInt(dest);

  }

  getTagId(tags: Tag[], name: string): number {

    let tag = tags.filter(p => p.Alias == ExchangeService.getAlias(name));

    if (tag && tag.length > 0) {
      return tag[0].Id;
    }

    return -1;
  }

  importTags(evt: any) {

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

      let allTags = await this.tagService.getAll();

      let newTags: Tag[] = []

      let productsTags: {
        ProductId: number,
        TagId: Number
      }[] = [];

      for (let i = 0; i < data.length; i++) {

        if (i == 0)
          continue;

        let row = data[i];

        if (!row[0])
          continue;

        if (!row[5] || row[5] == '')
          break;

        let tags = row[5].split(',');

        let productId = +row[0];

        tags.forEach(tagName => {

          let tagId = this.getTagId(allTags, tagName);

          if (tagId == -1) {

            if (newTags.filter(p => p.Alias == ExchangeService.getAlias(tagName)).length <= 0) {

              let tag = new Tag();
              tag.Alias = ExchangeService.getAlias(tagName);
              tag.Name = tagName;

              newTags.push(tag);

            }

          } else {

            if (productsTags.filter(p => p.ProductId == productId && p.TagId == tagId).length <= 0) {

              productsTags.push({
                ProductId: productId,
                TagId: tagId
              });

            }

          }

        });

      }

      if (newTags.length > 0) {
        this.tagService.bulkAdd(newTags);
        return;
      }

      this.tagService.addBulkProductTag(productsTags);

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
      var purchases: Purchase[] = [];

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

          } else {

            var int = parseInt(order.Id);

            if (int != undefined && int != undefined && !Number.isNaN(int)) {

              order.NumberId = int;

            } else {

              console.log('error id:', order.Id);

              order.NumberId = -1;

            }

          }

        } else {

          order.Id = Guid.create().toString();
          order.NumberId = -1;

        }

        order.CustomerId = row[0].toString();
        order.Created = ExchangeService.getTimeFromExcel(row[3]);
        order.DoneTime = order.Created;
        order.TotalAmount = this.detectPrice(row[7]);

        order.GainedScore = ExchangeService.getGainedScore(order.TotalAmount);

        let doneDate = new Date(order.Created);

        if (doneDate.getFullYear() == 2021) {
          order.Id = `21.${order.Id}`;
        } else {
          order.Id = `20.${order.Id}`;
        }

        while (true) {

          let duplicates = orders.filter(p => p.Id == order.Id && p.CustomerId != order.CustomerId);

          if (duplicates && duplicates.length > 0) {

            order.Id += "_";

          } else {

            break;

          }

        }

        var detail = new OrderDetail();

        detail.TotalAmount = order.TotalAmount;
        detail.OrderId = order.Id;
        detail.PurposeOf = row[4] ? row[4] : '';
        detail.State = OrderDetailStates.Completed;
        detail.ProductModifiedPrice = this.detectPrice(row[5])
        detail.ProductName = row[2] ? row[2] : '';
        detail.ProductImageUrl = 'https://images.vexels.com/media/users/3/156051/isolated/preview/72094c4492bc9c334266dc3049c15252-flat-flower-icon-flower-by-vexels.png';
        detail.IsHardcodeProduct = true;
        detail.ProductPrice = detail.ProductModifiedPrice;

        orderDetails.push(detail);

        order.TotalPaidAmount = 0;

        order.AmountDiscount = detail.ProductModifiedPrice - order.TotalAmount;

        orders.push(order);

        var purchaseType = row[8] && row[8] != '' ? row[8] : '';

        if (purchaseType != '') {

          let purchase = new Purchase();

          purchase.Amount = order.TotalAmount;
          purchase.AddingTime = order.Created;
          purchase.OrderId = order.Id;
          purchase.Note = "from excel file";
          purchase.Method = purchaseType == 'TM' ? PurchaseMethods.Cash : PurchaseMethods.Banking;

          purchases.push(purchase);

        }
      };

      let newOrders: Order[] = [];

      orders.forEach(order => {

        let duplicates = newOrders.filter(p => p.CustomerId == order.CustomerId && p.Id == order.Id);

        if (duplicates && duplicates[0]) {

          console.log('duplicate order:', duplicates);

          duplicates[0].TotalAmount += order.TotalAmount;
          duplicates[0].AmountDiscount += order.AmountDiscount;
          duplicates[0].GainedScore += ExchangeService.getGainedScore(duplicates[0].TotalAmount);

        }
        else {
          newOrders.push(order);
        }

      });

      newOrders.forEach(newOrder => {

        let orderPurs = purchases.filter(p => p.OrderId == newOrder.Id);

        if (orderPurs && orderPurs.length > 0) {

          orderPurs.forEach(pur => {
            newOrder.TotalPaidAmount += pur.Amount;
          });

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

        }
        else {

          let currentCus = cuses.filter(p => p.Id == order.CustomerId);

          if (currentCus && currentCus.length > 0) {

            editCustomers.push({
              Id: order.CustomerId,
              TotalAmount: order.TotalAmount,
              MemberType: ExchangeService.detectMemberShipType(order.TotalAmount),
              TotalUsedScore: 0,
              AvailableScore: 0
            });

          }
          else {

            order.CustomerId = 'KHACH_LE';

          }

        }

        if (+order.TotalAmount <= 1000)
          console.log(order);

      });

      editCustomers.forEach(cus => {
        cus.AvailableScore = ExchangeService.getGainedScore(cus.TotalAmount) - cus.TotalUsedScore;
      });

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

      console.log('------------------------------');

      let purchaselArray: Purchase[] = [];

      for (i = 0, j = purchases.length; i < j; i += chunk) {

        purchaselArray = purchases.slice(i, i + chunk);

        let update = await this.purchaseService.bulkInsert(purchaselArray);

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
    reader.onload = async (e: any) => {
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

              customer.ContactInfo.Zalo = zaloViber;

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

          customers.push(customer);

        }

        count += 1;

      });

      let oldCus = await this.customerService.getAll();

      let insertCustomer: Customer[] = [];

      customers.forEach(cus => {

        let dups = oldCus.filter(p => p.Id == cus.Id);

        if (dups && dups.length > 0) {
          console.log('error customer: ', dups);
        } else {
          insertCustomer.push(cus);
        }

      });


      this.customerService.createCustomers(insertCustomer).then(() => {
        this.stopLoading();
      });

    };

    reader.readAsBinaryString(target.files[0]);
  }

  goToPrintJob() {
  }


}
