import { Directive,  HostListener, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appImgHeight]'
})
export class ImgHeightDirective implements OnInit {

  constructor(private el:ElementRef) { }

  ngOnInit() {
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 12)/8 + 'px';
  }
  @HostListener('window:resize') moveright(){
    let width = this.el.nativeElement.offsetWidth;
    this.el.nativeElement.style.height = (width * 12)/8 + 'px';
  }
}
