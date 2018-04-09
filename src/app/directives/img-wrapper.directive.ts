import { Directive, HostListener, ElementRef } from '@angular/core';
import { Element } from '@angular/compiler';
import { log } from 'util';

@Directive({
  selector: '[appImgWrapper]'
})
export class ImgWrapperDirective  {

  constructor(private el:ElementRef) { }

  @HostListener('window:scroll') moveright(){
  
    if(window.innerWidth > 1000 ){

      if (window.pageYOffset >= 70) {
        this.el.nativeElement.style.left = (-(window.pageYOffset - 70)/5) + 'vw';
        this.el.nativeElement.style.opacity = (1/(window.pageYOffset/39));
      } else{
        this.el.nativeElement.style.left = 2 + 'px';
        this.el.nativeElement.style.opacity = 1;
      }

      if (window.pageYOffset > window.innerHeight/2) {
        this.el.nativeElement.style.display = "none";
      }else{
        this.el.nativeElement.style.display = "inline-block";      
      }
    }
    else{
      this.el.nativeElement.style.left = 50 + '%';
      this.el.nativeElement.style.transform = 'translateX('+ -50 + '%)';
    }
  }
}