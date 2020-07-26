import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt, TempProduct, ResultImage, DeliveryImage } from '../models/entities/file.entity';

@Injectable({
    providedIn: 'root'
})
export class DeliveryImageService extends BaseService<DeliveryImage> {

    protected get tableName(): string {
        return '/deliveryImageFiles';
    }

    constructor() {
        super();
    }

    public deleteFile(name: string): Promise<any> {

        var model = new TempProduct();
        return this.storageService.deleteFile(name, model.FolderName);
    }

    public addFile(file: ArrayBuffer | Blob | File, model: DeliveryImage, updateCompletedCallback: (fileUrl: string) => void) {

        this.startLoading();
        this.storageService.pushFileToStorage(file, model, (res) => {

            if (res === null) {
                this.stopLoading();
                updateCompletedCallback('ERROR');
            }

            this.insert(res as DeliveryImage).then(re => {
                this.stopLoading();
                updateCompletedCallback(res.Url);
            });

        });
    }


    public addFileFromBase64String(file: string, model: DeliveryImage, updateCompletedCallback: (fileUrl: string) => void) {
        this.startLoading();
        this.storageService.pushStringToStorage(file, model, (res) => {

            if (res === null) {
                this.stopLoading();
                updateCompletedCallback('ERROR');
            }

            this.insert(res as DeliveryImage).then(re => {
                this.stopLoading();
                updateCompletedCallback(res.Url);
            });

        });
    }

}
