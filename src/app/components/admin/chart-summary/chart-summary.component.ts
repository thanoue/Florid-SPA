import { Component, OnInit } from '@angular/core';
import { MenuItems, PurchaseMethods } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { BaseComponent } from '../base.component';
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from 'ng2-charts';
import { OrderService } from 'src/app/services/order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart-summary',
  templateUrl: './chart-summary.component.html',
  styleUrls: ['./chart-summary.component.css']
})
export class ChartSummaryComponent extends BaseComponent {

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];

  public lineChartOptions: ChartOptions = {
    responsive: true
  };

  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];

  protected PageCompnent: PageComponent = new PageComponent("Thống kê theo khoảng thời gian", MenuItems.DaysChart);

  selectedDates: Date[];

  constructor(private orderService: OrderService, private datePipe: DatePipe) {
    super();

    this.selectedDates = []

    let startDate = new Date();
    startDate.setDate(1);

    this.selectedDates.push(startDate, new Date());

    this.lineChartLabels = [];
    this.lineChartData = [];
  }

  protected Init() {

    this.getItems();
  }

  rangeSelected() {


    this.getItems();
  }

  getItems() {

    this.lineChartLabels = [];
    this.lineChartData = [];

    this.orderService.getSaleTotalByRange([this.selectedDates[0].getTime(), this.selectedDates[1].getTime()], PurchaseMethods.All)
      .then(data => {

        if (data == null)
          return;

        var delta = 1000 * 60 * 60 * 24;

        let labels: string[] = [];
        let values: number[] = [];

        var tempDate = this.selectedDates[0].getTime();
        while (tempDate <= this.selectedDates[1].getTime()) {
          labels.push(this.datePipe.transform(tempDate, "dd/MM"));
          values.push(0);
          tempDate = tempDate + delta;
        }

        let val = 0;
        let currentDate = new Date(data[0].CreatedDate.getTime());

        data.forEach(saleItem => {

          if (saleItem.CreatedDate.getDate() != currentDate.getDate()) {

            var index = labels.indexOf(this.datePipe.transform(currentDate, "dd/MM"));

            currentDate = new Date(saleItem.CreatedDate.getTime());

            if (index > -1) {
              values[index] = val;
            }

            val = saleItem.FinalTotal;

          } else {
            val += saleItem.FinalTotal;
          }

        });

        this.lineChartLabels = labels;

        let index = labels.indexOf(this.datePipe.transform(currentDate, "dd/MM"));
        if (index > -1) {
          values[index] = val;
        }

        this.lineChartData.push({
          data: values, label: "Doanh số", borderColor: "black",
          backgroundColor: "rgba(255,0,0,0.3)"
        })

      });

  }



}
