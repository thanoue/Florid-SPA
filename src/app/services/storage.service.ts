import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BaseFile } from '../models/entities/file.entity';
import { GlobalService } from './common/global.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private globalService: GlobalService) { }

    // tslint:disable-next-line:max-line-length
    pushFileToStorage(file: ArrayBuffer | Blob | File, fileUpload: BaseFile, uploadedCallback: (fileUpload: BaseFile) => void): void {

        if (file == null) {
            return;
        }

        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${fileUpload.FolderName}/${fileUpload.Name}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // in progress
            },
            (error) => {
                // fail  
                uploadedCallback(null);
                this.globalService.showError(error.message);
            },
            () => {
                // success
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    fileUpload.Url = url;
                    uploadedCallback(fileUpload);
                });
            }
        );
    }

    async push(file: ArrayBuffer | Blob | File, folderName: string, fileName): Promise<string> {

        if (file == null) {
            return;
        }

        var promise = new Promise<string>((resolve, rejects) => {

            const storageRef = firebase.storage().ref();
            const uploadTask = storageRef.child(`${folderName}/${fileName}`).put(file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    // in progress
                },
                (error) => {
                    // fail  
                    rejects(error.message);
                    console.warn(error.message);
                },
                () => {
                    // success
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        resolve(url);
                    });
                }
            );
        });

        return promise;
    }

    deleteFile(name: string, folderName: string): Promise<any> {
        return firebase.storage().ref().child(`${folderName}/${name}`).delete();
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

        if (file == null) {
            return;
        }

        this.globalService.startLoading();

        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${fileUpload.FolderName}/${fileUpload.Name}`).putString(file, 'data_url');

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // in progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // fail
                uploadedCallback(null);
                console.log(error);
            },
            () => {
                // success
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    fileUpload.Url = url;
                    uploadedCallback(fileUpload);
                    this.globalService.stopLoading();

                });
            }
        );
    }
}