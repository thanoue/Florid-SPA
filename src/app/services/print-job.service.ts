import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { PrintJob } from '../models/entities/printjob.entity';

@Injectable({
  providedIn: 'root'
})
export class PrintJobService extends BaseService<PrintJob>{

  protected get tableName(): string {
    return '/printJobs';
  }


  printJobAdd(callback: (data: PrintJob) => void) {

    this.tableRef.on('child_added', (data) => {
      callback(data.val() as PrintJob);
    });

  }
}
