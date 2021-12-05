import { Injectable } from '@angular/core';
import { PrintJob } from '../models/entities/printjob.entity';

declare function invokePrintJob(data: any): any;

@Injectable({
  providedIn: 'root'
})
export class PrintJobService {

  constructor() {

  }

  addPrintJob(printJob: PrintJob) {

    invokePrintJob(printJob);

  }

}
