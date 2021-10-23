import { Component, OnInit } from '@angular/core';
import { MenuItems, PurchaseMethods } from 'src/app/models/enums';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { BaseComponent } from '../base.component';
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from 'ng2-charts';
import { OrderService } from 'src/app/services/order.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthly-chart',
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.css']
})
export class MonthlyChartComponent extends BaseComponent {

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions = {
    responsive: true
  };
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];
  public curentYear: number;

  protected PageCompnent: PageComponent = new PageComponent("Thống kê theo năm", MenuItems.MonthsChart);

  constructor(private orderService: OrderService, private datePipe: DatePipe) {
    super();

    this.lineChartLabels = [];
    this.lineChartData = [];
    this.curentYear = (new Date()).getFullYear()
  }

  protected Init() {

    this.getItems();
  }

  searchByYear(event: any) {
    this.curentYear = event;
    this.getItems();
  }

  getItems() {

    this.lineChartLabels = [];
    this.lineChartData = [];

    this.orderService.getSaleTotalByYear(this.curentYear, PurchaseMethods.All)
      .then(data => {

        if (data == null)
          return;

        let labels: string[] = [];
        let values: number[] = [];

        for (var i = 1; i <= 12; i++) {

          labels.push(`${i}/${this.curentYear}`);
          values.push(0);

        }

        let val = 0;
        let currentDate = new Date(data[0].CreatedDate.getTime());

        data.forEach(saleItem => {

          if (saleItem.CreatedDate.getMonth() != currentDate.getMonth()) {

            var index = labels.indexOf(this.datePipe.transform(currentDate, "M/yyyy"));

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

        let index = labels.indexOf(this.datePipe.transform(currentDate, "MM/yyyy"));
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
