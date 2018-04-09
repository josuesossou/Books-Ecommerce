import { Directive, HostListener, ElementRef } from '@angular/core';
import { Element } from '@angular/compiler';
import { log } from 'util';

@Directive({
  selector: '[appStartScrollAnimation]'
})
export class StartScrollAnimationDirective {

  constructor(private el:ElementRef) { }

  @HostListener('click') scrollDown(){
      
      let pos = 1;
      let id = setInterval(()=>{
        if (pos > (window.innerHeight)){
          clearInterval(id);
        }else {
          pos=pos+5;
          window.scrollTo(0, pos);
        }
      }, 5);
      
    }

}
