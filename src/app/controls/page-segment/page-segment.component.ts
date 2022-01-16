import { Component, Input, forwardRef, Optional, OnInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm } from '@angular/forms';
@Component({
  selector: 'app-page-segment',
  templateUrl: './page-segment.component.html',
  styleUrls: ['./page-segment.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PageSegmentComponent),
    multi: true
  }]
})
export class PageSegmentComponent implements OnInit {

  _currentPage = 1;
  _pageCount: number;

  @Input()
  get pageCount() {
    return this._pageCount;
  }

  set pageCount(count) {
    this._pageCount = count;
  }

  @Input()
  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page) {
    this._currentPage = page;
  }

  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  onChange: (_: any) => void = (_: any) => { };
  onTouched: () => void = () => { };

  constructor(
    @Optional() private ngForm: NgForm
  ) {

  }
  ngOnInit(): void {
  }

  gotoPage(page: number) {

    if (page === this.currentPage) {
      return;
    }

    this.currentPage = page;

    this.pageChanged.next(page);

  }

}
