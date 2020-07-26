import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt } from '../models/entities/file.entity';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService extends BaseService<Receipt> {

  protected tableName = '/receipts';

  constructor() {
    super();
  }

  public uploadReceipt(file: File | Blob, receipt: Receipt, receiptId: string, updateCompletedCallback: (receiptUrl: string) => void) {

    this.storageService.pushFileToStorage(file, receipt, (res) => {

      updateCompletedCallback(res.Url);

      this.db.ref(`${this.tableName}/${receiptId}`).set(res).then(snap => {

      });

    });

  }
}
