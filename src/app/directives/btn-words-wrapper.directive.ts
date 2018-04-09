import { Directive, HostListener, ElementRef } from '@angular/core';
import { Element } from '@angular/compiler';
import { log } from 'util';

@Directive({
  selector: '[appBtnWordsWrapper]'
})
export class BtnWordsWrapperDirective {

  hieghtToMove = window.innerHeight/2;

  constructor(private el:ElementRef) {

    if(window.innerWidth > 1000 ){

      let width = this.el.nativeElement.offsetWidth;  

      if (window.pageYOffset >=this.hieghtToMove && this.el.nativeElement.style.display == '' || this.el.nativeElement.style.display == 'none' ) {
        this.el.nativeElement.style.left =  100 + 'vw';                
        this.el.nativeElement.style.display = 'inline-block';
        this.move();
  
      } else if(window.pageYOffset < this.hieghtToMove) {
        this.el.nativeElement.style.left =  100 + 'vw';                        
        this.el.nativeElement.style.display = 'none';      
      }

    }else{

      this.el.nativeElement.style.left =  0 + 'vw';                
      this.el.nativeElement.style.display = 'inline-block';

    }

   }

  @HostListener('window:scroll') moveright(){

    if(window.innerWidth > 1000 ){

      let width = this.el.nativeElement.offsetWidth;  

        if (window.pageYOffset >=this.hieghtToMove && this.el.nativeElement.style.display == 'none' ) {
          this.el.nativeElement.style.left =  100 + 'vw';                
          this.el.nativeElement.style.display = 'inline-block';
          this.move();
    
        } else if(window.pageYOffset < this.hieghtToMove) {
          this.el.nativeElement.style.left =  100 + 'vw';                        
          this.el.nativeElement.style.display = 'none';      
        }
      }else{

        this.el.nativeElement.style.left =  0 + 'vw';                
        this.el.nativeElement.style.display = 'inline-block';

      }

    }

    @HostListener('window:load') moverightonLoad(){

      if(window.innerWidth > 1000 ){

        let width = this.el.nativeElement.offsetWidth;  

          if (window.pageYOffset >=this.hieghtToMove && this.el.nativeElement.style.display == '' || this.el.nativeElement.style.display == 'none' ) {
            this.el.nativeElement.style.left =  100 + 'vw';                
            this.el.nativeElement.style.display = 'inline-block';
            this.move();
      
          } else if(window.pageYOffset < this.hieghtToMove) {
            this.el.nativeElement.style.left =  100 + 'vw';                        
            this.el.nativeElement.style.display = 'none';      
          }
        }else{

          this.el.nativeElement.style.left =  0 + 'vw';                
          this.el.nativeElement.style.display = 'inline-block';

        }


      }

    move(){
      let pos = 100;

      let id = setInterval(()=>{

        if (pos < 5){
          clearInterval(id);
        }else {
          pos=pos-1;
          this.el.nativeElement.style.left = pos + 'vw';
        }

      }, 1);
    }


}
