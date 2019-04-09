import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBeautyStyle]',
  exportAs: 'beautyStyle'
})
export class BeautyStyleDirective {

  constructor(private elementRef: ElementRef) {
    let st = this.elementRef.nativeElement.style
    st.color = 'white';
    st.backgroundColor  = 'gray';
    st.border  = '1px solid black';
    st.position = 'fixed';
    st.bottom = '10px';
    st.right = '10px';

  }

}
