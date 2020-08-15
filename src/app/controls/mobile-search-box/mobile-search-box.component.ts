import { Component, OnInit, Optional, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormBuilder, NgForm, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'mobile-search-box',
  templateUrl: './mobile-search-box.component.html',
  styleUrls: ['./mobile-search-box.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MobileSearchBoxComponent),
    multi: true
  }]
})
export class MobileSearchBoxComponent implements ControlValueAccessor, OnInit {

  value: any;
  @Input() placeholder = '';
  @Input() delayTimeSpan = 1000;
  @Output() searchTextInvoke: EventEmitter<string> = new EventEmitter();

  onChange: (_: any) => void = (_: any) => { };
  onTouched: () => void = () => { };

  searchContent = new FormControl();
  searchForm: FormGroup = this.formBuilder.group({
    searchContent: this.searchContent
  });

  constructor(private formBuilder: FormBuilder, @Optional() private ngForm: NgForm) {
  }

  ngOnInit(): void {
    this.searchContent.valueChanges.pipe(
      debounceTime(this.delayTimeSpan),
      tap()
    ).subscribe(res => {
      this.searchTextInvoke.emit(res);
    });
  }

  preventEvent(event) {
    event.stopPropagation();
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateChanges() {
    this.onChange(this.value);
  }
}

