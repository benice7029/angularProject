import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appColorful]',
  exportAs: 'colorful'
})
export class ColorfulDirective {

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.style.color = 'white';
    this.elementRef.nativeElement.style.backgroundColor  = 'gray';
    this.elementRef.nativeElement.style.border  = '1px solid black';
   }

}