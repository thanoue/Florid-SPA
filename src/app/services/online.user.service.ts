import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { OnlineUser } from '../models/entities/online.user.entity';

@Injectable({
  providedIn: 'root'
})
export class OnlineUserService extends BaseService<OnlineUser> {

  protected get tableName(): string {
    return '/onlineUsers';
  }


  constructor() {
    super();
  }

  loginTimeChanging(userId: string, callback: (userId: string) => void) {

    this.db.ref(`${this.tableName}/${userId}`).on('child_changed', (data) => {

      callback(userId);
      this.tableRef.off('child_changed');

    });

  }

}
