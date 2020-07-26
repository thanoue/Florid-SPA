import { Injectable } from '@angular/core';
import { BaseFile } from '../models/entities/file.entity';
import { GlobalService } from './common/global.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private globalService: GlobalService) { }

    // tslint:disable-next-line:max-line-length
    pushFileToStorage(file: ArrayBuffer | Blob | File, fileUpload: BaseFile, uploadedCallback: (fileUpload: BaseFile) => void): void {


    }

    async push(file: ArrayBuffer | Blob | File, folderName: string, fileName): Promise<string> {

        return '';
    }

    deleteFile(name: string, folderName: string): Promise<any> {
        return;
    }

    downloadFIle(url: string, callback: (file: Blob) => void) {

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function (event) {
            var blob = xhr.response;
            callback(blob);
        };

        xhr.open('GET', url);
        xhr.send();
    }

    pushStringToStorage(file: string, fileUpload: BaseFile, uploadedCallback: (fileUpload: BaseFile) => void): void {


    }
}