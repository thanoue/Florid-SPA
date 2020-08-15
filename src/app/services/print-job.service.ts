import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { PrintJob } from '../models/entities/printjob.entity';
import { LocalService } from './common/local.service';
import { RealtimeService } from './realtime.service';

declare function doPrintJob(data: any): any;
declare function invokePrintJob(data: any): any;

@Injectable({
  providedIn: 'root'
})
export class PrintJobService {

  constructor() {

  }

  doPrintJob(printJob: PrintJob) {
    doPrintJob(printJob);
  }

  addPrintJob(printJob: PrintJob) {
    if (LocalService.isPrinter()) {
      this.doPrintJob(printJob);
    }
    else {
      invokePrintJob(printJob);
    }
  }

}
