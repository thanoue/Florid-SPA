import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order } from '../models/entities/order.entity';
import { ProductImage } from '../models/entities/file.entity';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService extends BaseService<ProductImage> {

  protected tableName = '/productImages';

  constructor() {
    super()
  }

  public deleteFile(name: string): Promise<any> {
    var model = new ProductImage();
    return this.storageService.deleteFile(name, model.FolderName);
  }

  public deleteFileFromUrl(url: string): Promise<any> {

    return this.tableRef.orderByChild('Url').equalTo(url).once('value')
      .then(res => {

        let prodImg: ProductImage = null;
        res.forEach(snap => {
          prodImg = snap.val() as ProductImage;
        });

        if (prodImg == null)
          return;

        return this.storageService.deleteFile(prodImg.Name, prodImg.FolderName);

      }).catch(err => {
        console.error(err);
        return;
      });
  }


  public addFile(file: ArrayBuffer | Blob | File, model: ProductImage, updateCompletedCallback: (fileUrl: string) => void) {
    this.storageService.pushFileToStorage(file, model, (res) => {

      if (res === null) {
        updateCompletedCallback('ERROR');
      }

      updateCompletedCallback(res.Url);

      this.set(res as ProductImage).then(re => {

      });

    });
  }

}
