import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt, TempProduct } from '../models/entities/file.entity';

@Injectable({
  providedIn: 'root'
})
export class TempProductService extends BaseService<TempProduct> {

  protected get tableName(): string {
    return '/tempProducts';
  }

  constructor() {
    super();
  }

  public deleteFile(name: string): Promise<any> {

    var model = new TempProduct();
    return this.storageService.deleteFile(name, model.FolderName);
  }

  public addFile(file: ArrayBuffer | Blob | File, model: TempProduct, updateCompletedCallback: (fileUrl: string) => void) {
    this.storageService.pushFileToStorage(file, model, (res) => {

      if (res === null) {
        updateCompletedCallback('ERROR');
      }

      updateCompletedCallback(res.Url);

      // this.insert(res as TempProduct).then(re => {

      // });

    });
  }


  public addFileFromBase64String(file: string, model: TempProduct, updateCompletedCallback: (fileUrl: string) => void) {
    this.storageService.pushStringToStorage(file, model, (res) => {

      if (res === null) {
        updateCompletedCallback('ERROR');
      }

      updateCompletedCallback(res.Url);

      // this.insert(res as TempProduct).then(re => {

      // });

    });
  }

}
