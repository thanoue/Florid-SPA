import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import * as firebase from 'firebase';
import { MomoTrans } from '../models/entities/momo.trans.entity';

@Injectable({
    providedIn: 'root'
})
export class MomoTransService extends BaseService<MomoTrans> {

    protected tableName = '/momoTrans';

    constructor() {
        super();
    }

    updateNewTransResult(transAddedCallback: (res: MomoTrans) => void) {
        this.tableRef.on('child_added', (data) => {
            transAddedCallback.call(this, data.val());
        });
    }

    removeNewTransResultHandler() {
        this.tableRef.off('child_added');
    }
}