import { AppInjector } from './base.injector';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import * as firebase from 'firebase';
import { BaseEntity } from 'src/app/models/entities/base.entity';
import { Guid } from 'guid-typescript';
import { StorageService } from '../storage.service';

export abstract class BaseService<T extends BaseEntity> {


    protected globalService: GlobalService;
    protected storageService: StorageService;

    protected abstract get tableName(): string;

    protected get tableRef(): firebase.database.Reference {
        return this.db.ref(this.tableName);
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }

    protected errorToast(message: string) {
        this.globalService.showError(message);
    }
    protected infoToast(message: string) {
        this.globalService.showInfo(message);
    }
    protected warningToast(message: string) {
        this.globalService.showWarning(message);
    }
    protected successToast(message: string) {
        this.globalService.showSuccess(message);
    }

    protected get db(): firebase.database.Database {
        return firebase.database();
    }

    constructor() {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.storageService = injector.get(StorageService);
    }

    deleteFileByUrl(url: string, callback: (isDeleted: boolean) => void): void {

        if (!url || url === '') {
            callback(true);
            return;
        }

        this.startLoading();
        this.tableRef.orderByChild("Url").equalTo(url)
            .once('value')
            .then(snapShot => {

                var image: any;

                snapShot.forEach(snap => {
                    image = snap.val();
                });

                if (!image) {
                    this.stopLoading();
                    callback(true);
                    return;
                }

                this.storageService.deleteFile(image.Name, image.FolderName)
                    .then(() => {
                        this.stopLoading();
                        callback(true);
                        this.delete(image.Id);
                    })
                    .catch((err) => {
                        callback(false);
                        this.stopLoading();
                        this.errorToast(err);
                    });
            })
    }


    updateList(updates: {}, onDone: () => void): Promise<void> {
        return this.tableRef.update(updates, (err) => {
            if (err) {
                this.errorToast(err.message);
            } else {
                onDone();
            }
        })
    }

    getByFieldName(fieldName: string, value: any): Promise<T[]> {

        this.globalService.startLoading();

        return this.tableRef.orderByChild(fieldName).equalTo(value).once('value')
            .then(snapShot => {

                this.globalService.stopLoading();

                const items: T[] = [];

                snapShot.forEach(data => {

                    const prd = data.val() as T;

                    items.push(prd);

                });

                return items;

            })
            .catch(error => {
                this.globalService.stopLoading();
                this.globalService.showError(error);
                return [];
            });
    }

    public setAnotherEntity(model: any, tableName: string): Promise<any> {

        return this.db.ref(`${tableName}/${model.Id}`).set(model).then(res => {
            if (res) {
                return model;
            }
        });

    }

    public set(model: T): Promise<T> {

        if (!model.Id || model.Id == '') {
            model.Id = Guid.create().toString();
        }

        this.startLoading();

        return this.db.ref(`${this.tableName}/${model.Id}`).set(model).then(res => {
            this.stopLoading();
            return model;
        })
            .catch(err => {
                this.errorToast(err.message);
                this.stopLoading();
                throw new err;
            });
    }

    public insert(model: T): Promise<T> {

        this.startLoading();

        const pushRef = this.tableRef.push(model);

        model.Id = pushRef.key;

        return this.update(model);
    }


    async setListSeperate(data: T[]): Promise<any> {

        const list = [];

        for (const item of data) {

            this.set(item).catch(error => {
                throw error;
            });

        }

        return list;
    }

    async setList(data: T[]): Promise<any> {

        const list = [];

        for (const item of data) {

            const newItem = await this.set(item).catch(error => {
                throw error;
            });

            if (newItem) {
                list.push(newItem);
            } else {
                continue;
            }
        }
        return list;
    }


    async insertList(data: T[]): Promise<T[]> {

        const products: T[] = [];
        this.startLoading();

        for (let i = 0; i < data.length; i++) {

            const newData = await this.insert(data[i]);

            if (newData) {
                products.push(newData);
                continue;
            } else {
                console.log('error insert');
                continue;
            }
        }

        return products;
    }

    public getById(id: string): Promise<T> {
        this.startLoading();
        return this.db.ref(`${this.tableName}/${id}`).once('value').then(data => {

            this.stopLoading();
            if (!data) {
                return null;
            }

            return data.val() as T;

        }).catch(error => {
            this.stopLoading();
            console.log(error);
            return null;
        });

    }

    public updateSingleField(id: string, fieldName: string, value: any): Promise<any> {

        this.startLoading();
        var updates = {};

        updates[`/${id}/${fieldName}`] = value;
        return this.tableRef.update(updates, (err) => {

            this.stopLoading();
            if (err != null) {
                this.errorToast(err.message);
            }

        });
    }

    public updateFields(updates: {}): Promise<any> {

        this.startLoading();

        return this.tableRef.update(updates, (err) => {

            this.stopLoading();
            if (err != null) {
                this.errorToast(err.message);
            }

        });
    }



    public update(value: T): Promise<T> {

        return this.tableRef.child(value.Id).set(value).then(() => {

            this.stopLoading();

            return value;
        });

    }

    public delete(id: string): Promise<void> {
        this.startLoading();
        return this.db.ref(`${this.tableName}/${id}`).remove().then(() => {
            this.stopLoading();
        });
    }

    public async deleteMany(ids: string[]): Promise<void> {
        this.startLoading();

        var rem: any = null;
        ids.forEach(async id => {

            rem = await this.db.ref(`${this.tableName}/${id}`).remove();

        });
        if (rem)
            this.stopLoading();
        else
            this.stopLoading();
    }


    public getAllWithOrder(orderField: string): Promise<T[]> {

        this.startLoading();

        return this.tableRef.orderByChild(orderField).once('value')
            .then(dataSnapShot => {

                const res: T[] = [];
                dataSnapShot.forEach(data => {
                    res.push(data.val() as T);
                });

                this.stopLoading();

                return res;
            })
            .catch(error => {
                this.errorToast(error);
                this.stopLoading();
                return [];
            });
    }

    public getAll(): Promise<T[]> {

        this.startLoading();

        return this.tableRef.once('value')
            .then(dataSnapShot => {

                const res: T[] = [];
                dataSnapShot.forEach(data => {
                    res.push(data.val() as T);
                });

                this.stopLoading();

                return res;
            })
            .catch(error => {
                this.errorToast(error);
                this.stopLoading();
                return [];
            });
    }

    public deleteAll(): Promise<void> {

        this.startLoading();
        return this.tableRef.remove().then(() => {
            this.stopLoading();
            return;
        });
    }
}
