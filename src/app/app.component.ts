import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from './services/common/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private globalService: GlobalService) { }

  spinnerCallback: Subscription;
  loading = false;

  ngOnInit(): void {

    this.spinnerCallback = this.globalService.spinnerInvoke
      .subscribe(isLoading => {
        setTimeout(() => {
          this.loading = isLoading;
        }, 100);
      });

  }

}
