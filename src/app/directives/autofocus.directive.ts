import { Directive, ElementRef, AfterViewInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit, OnChanges {

  @Input() autofocus: boolean = false; // Eingangsbindung, die wir überwachen

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.autofocus) {
      this.setFocus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autofocus'] && this.autofocus) {
      this.setFocus();
    }
  }

  private setFocus(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0); // Timeout, um sicherzustellen, dass das Element vollständig gerendert ist
  }
}
