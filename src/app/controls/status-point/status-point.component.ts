import { Component, OnInit, Optional, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormBuilder, NgForm, FormGroup } from '@angular/forms';
import { OrderDetailStates } from 'src/app/models/enums';

@Component({
  selector: 'app-status-point',
  templateUrl: './status-point.component.html',
  styleUrls: ['./status-point.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StatusPointComponent),
    multi: true
  }]
})
export class StatusPointComponent implements OnInit {

  states = OrderDetailStates;
  constructor() { }

  ngOnInit(): void {
  }

  @Input() state: OrderDetailStates;
  @Input() index = -1;
  @Input() id = '';
  @Output() onClicked: EventEmitter<string> = new EventEmitter<string>();

  onChange: () => void = () => { };
  onTouched: () => void = () => { };

  pointClicked() {
    this.onClicked.emit(this.id);
  }

  preventEvent(event) {
    event.stopPropagation();
  }

  writeValue(value: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateChanges() {
    this.onChange();
  }
}
