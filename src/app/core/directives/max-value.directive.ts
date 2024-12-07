import {Directive, ElementRef, HostListener, Input} from '@angular/core'

@Directive({
  standalone: true,
  selector: '[setMaxValue]'
})
export class MaxValueDirective {

  @Input('setMaxValue') maxValue: number | undefined

  constructor(private el: ElementRef) {}

  @HostListener('blur') onBlur() {
    let inputValue = parseFloat(this.el.nativeElement.value)
    if (isNaN(inputValue)) {
      this.el.nativeElement.value = 0
    } else if (this.maxValue && inputValue > this.maxValue) {
      this.el.nativeElement.value = this.maxValue
    }
  }
}
