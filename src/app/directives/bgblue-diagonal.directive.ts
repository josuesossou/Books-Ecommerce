import { Directive, HostListener, ElementRef } from '@angular/core';
import { Element } from '@angular/compiler';
import { log } from 'util';

@Directive({
  selector: '[appBgblueDiagonal]'
})
export class BgblueDiagonalDirective {

  constructor(private el:ElementRef) { }
  
    @HostListener('window:scroll') moveTop(){
      this.el.nativeElement.style.top= (-window.pageYOffset/20)  - 30 + 'vh';      
    }

}
