import { Component, Input, forwardRef, Optional, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgForm } from '@angular/forms';
@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextBoxComponent),
    multi: true
  }]
})
export class TextBoxComponent implements ControlValueAccessor {
  value: any;
  @Input() placeholder = '';
  @Input() required: boolean;
  @Input() type = 'text';
  @Input() name: string;
  @Input() disabled: boolean;

  onChange: (_: any) => void = (_: any) => { };
  onTouched: () => void = () => { };

  constructor(
    @Optional() private ngForm: NgForm
  ) {
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

  invalid() {

    if (!this.ngForm) {
      return false;
    }

    const control = this.ngForm.form.get(this.name);
    return control && control.invalid && (control.dirty || this.ngForm.submitted);
  }

  valid() {

    if (!this.ngForm) {
      return false;
    }

    const control = this.ngForm.form.get(this.name);
    return control && control.valid && (control.dirty || this.ngForm.submitted);
  }

}
