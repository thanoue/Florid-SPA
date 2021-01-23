import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { timeStamp } from 'console';
import { PurchaseMethods } from 'src/app/models/enums';
import { Purchase } from 'src/app/models/view.models/purchase.entity';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BaseComponent } from '../base.component';

declare function openAddPurchaseDialog(): any;
declare function moveCursor(id: string, pos: number);
declare function dissmissAddPurchaseDialog(): any;

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent extends BaseComponent {

  Title = "Thanh toán nặc danh";

  purchases: Purchase[];
  currPurchase: Purchase;
  currentIndex = -1;
  currentAddingTime: Date;
  purchaseMethod = PurchaseMethods;


  constructor(private purchaseService: PurchaseService) {
    super();
    this.currPurchase = new Purchase();
    this.purchases = [];
    this.currentAddingTime = new Date();
  }

  protected Init() {

  }

  selectItem(purchase: Purchase, index: number) {

    this.currentIndex = index;

    this.currPurchase = new Purchase();
    this.currPurchase.Amount = purchase.Amount;
    this.currentAddingTime = new Date(purchase.AddingTime);
    this.currPurchase.Id = purchase.Id;
    this.currPurchase.Method = purchase.Method;
    this.currPurchase.OrderId = purchase.OrderId;
    this.currPurchase.Note = purchase.Note;

    openAddPurchaseDialog();

  }

  addPurchase() {

    this.currPurchase = new Purchase();
    this.currPurchase.Amount = 0;
    this.currentAddingTime = (new Date());
    this.currPurchase.Id = 0;
    this.currPurchase.Method = PurchaseMethods.Banking;
    this.currPurchase.OrderId = '';
    this.currPurchase.Note = '';

    openAddPurchaseDialog();

  }

  onAmountChanged(value) {

    if (this.currPurchase.Amount < 10) {

      this.currPurchase.Amount *= 1000;

      this.moveCursor(this.currPurchase.Amount.toString().length, 'Amount');

    }

    this.currPurchase.Amount = +this.currPurchase.Amount;

  }

  onAmountFocus() {

    if (!this.currPurchase.Amount) {
      this.currPurchase.Amount = 0;
    }
    this.moveCursor(this.currPurchase.Amount.toString().length, 'Amount');
  }

  purchaseSaving(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (this.currentIndex > -1) {
      Object.assign(this.purchases[this.currentIndex], this.currPurchase);
      this.purchases[this.currentIndex].AddingTime = this.currentAddingTime.getTime();
      this.currentIndex = -1;
    } else {
      this.currPurchase.AddingTime = this.currentAddingTime.getTime();
      this.purchases.push(this.currPurchase);
    }

    dissmissAddPurchaseDialog();

  }

  saveChanges() {

    if (this.purchases.length <= 0)
      return;

    this.purchaseService.bulkCreate(this.purchases, '', () => {
      this.purchases = [];
    });

  }

}
