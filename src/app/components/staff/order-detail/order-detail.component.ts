import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, retry } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { TempProduct } from 'src/app/models/entities/file.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { CategoryService } from 'src/app/services/category.service';

declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string): any;
declare function getTextInput(resCallback: (res: string) => void, placeHolder: string, oldValue: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
declare function selectProductCategory(menuitems: { Name: string; Value: number; }[], callback: (index: any) => void): any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent implements OnDestroy {

  Title = 'Chi tiết đơn';

  orderDetail: OrderDetailViewModel;
  detailIndex: number;

  categories: {
    Value: number,
    Name: string
  }[];

  constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) {
    super();
    this.categories = [];
  }

  protected Init() {

    this.route.params.subscribe(params => {

      this.detailIndex = + params.id;

      this.orderDetail = this.globalOrderDetail;

      this.orderDetail.AdditionalFee /= 1000;

      if (!this.orderDetail.PurposeOf) this.orderDetail.PurposeOf = 'Mua tặng';

      createNumbericElement(this.detailIndex > -1, (val) => {
        this.orderDetail.Quantity = val;
      });

      this.categoryService.getAll()
        .then((cates) => {

          cates.forEach(cate => {
            this.categories.push({
              Value: cate.Id,
              Name: cate.Name
            })
          });

        });
    });

  }

  destroy() {
    if (this.globalOrderDetail) {
      this.globalOrderDetail.AdditionalFee *= 1000;
    }
  }

  productNameChangeRequest() {
    getTextInput(res => {
      this.orderDetail.ProductName = res;
    }, 'Cập nhật tên sản phẩm...', this.orderDetail.ProductName);
  }

  insertModifiedValue() {
    getNumberInput(res => {
      this.orderDetail.ModifiedPrice = res;
    }, 'Cập nhật giá...');
  }

  searchProduct() {

    selectProductCategory(this.categories, (val) => {

      this.router.navigate(['/admin/search-product'], { queryParams: { category: +val }, queryParamsHandling: 'merge' });

    });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.globalOrderDetail.DeliveryInfo.Address
      || !this.globalOrderDetail.DeliveryInfo.PhoneNumber
      || !this.globalOrderDetail.DeliveryInfo.FullName
      || !this.globalOrderDetail.DeliveryInfo.DateTime) {
      this.showWarning('Thiếu thông in giao hàng!');
      return;
    }

    if (this.globalOrderDetail.ModifiedPrice <= 0) {
      this.showWarning('Chưa nhập giá tiền!');
      return;
    }

    if (!this.globalOrderDetail.IsFromHardCodeProduct && (!this.globalOrderDetail.ProductId || this.globalOrderDetail.ProductId === '')) {
      this.showWarning('Chưa chọn sản phẩm');
      return;
    }

    this.globalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.globalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.globalOrderDetail);

    this.globalOrderDetail = null;

    this.insertOrderDetail(viewModel);
  }

  insertOrderDetail(viewModel: OrderDetailViewModel) {

    viewModel.AdditionalFee *= 1000;
    const newIndexes: number[] = [];

    if (this.detailIndex > -1) {

      this.globalOrder.OrderDetails[this.detailIndex] = viewModel;

    } else {

      let index = viewModel.Index;

      for (let i = 0; i < viewModel.Quantity; i++) {

        const subItem = OrderDetailViewModel.DeepCopy(viewModel);

        subItem.Quantity = 1;

        subItem.Index = index;

        this.globalOrder.OrderDetails.push(subItem);

        newIndexes.push(index);

        index += 1;
      }
    }

    super.OnBackNaviage();
  }
}
