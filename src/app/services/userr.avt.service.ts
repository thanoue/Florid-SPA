import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt, TempProduct, ResultImage, DeliveryImage, UserAvtImage } from '../models/entities/file.entity';

@Injectable({
    providedIn: 'root'
})
export class UserAvtService extends BaseService<UserAvtImage> {

    protected get tableName(): string {
        return '/userAvtImgFiles';
    }

    constructor() {
        super();
    }


    public deleteFile(name: string): Promise<any> {

        var model = new TempProduct();
        return this.storageService.deleteFile(name, model.FolderName);
    }

    public addFile(file: ArrayBuffer | Blob | File, model: UserAvtImage, updateCompletedCallback: (fileUrl: string) => void) {

        this.startLoading();

        this.storageService.pushFileToStorage(file, model, (res) => {

            if (!res || res === null) {
                this.stopLoading();
                updateCompletedCallback('ERROR');
            }

            this.stopLoading();
            updateCompletedCallback(res.Url);

            this.insert(res as UserAvtImage).then(re => {
                console.log('inserted new image');
            });

        });
    }
}
