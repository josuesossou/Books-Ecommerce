import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  constructor(private sanitize:DomSanitizer) { }

  windowSize:boolean;

  books:any[] = [
    {
      bookImg: this.sanitize.bypassSecurityTrustStyle("background:url('../../../assets/books/book1.jpg') no-repeat center;background-size: contain;"),
      title:"Glances in the Spirit of God",
      src:this.sanitize.bypassSecurityTrustUrl('https://www.amazon.com/Glances-Spirit-God-Philip-Sossou-ebook/dp/B0773VCFZX/ref=sr_1_1?s=books&ie=UTF8&qid=1515119118&sr=1-1&keywords=philip+sossou')
    },  
    {
      bookImg: this.sanitize.bypassSecurityTrustStyle("background:url('../../../assets/books/book2.jpg') no-repeat center;background-size: contain;"),
      title:"Bullying No More",
      src:this.sanitize.bypassSecurityTrustUrl('https://www.amazon.com/Bullying-No-More-Philip-Sossou-ebook/dp/B0762ZGRYH/ref=sr_1_4?s=books&ie=UTF8&qid=1515119118&sr=1-4&keywords=philip+sossou')
    }, 
    {
      bookImg: this.sanitize.bypassSecurityTrustStyle("background:url('../../../assets/books/book3.jpg') no-repeat center;background-size: contain;"),
      title:"Coups d'oeil dans l'Esprit de Dieu",
      src:this.sanitize.bypassSecurityTrustUrl('https://www.amazon.com/Coups-doeil-dans-lEsprit-French/dp/1981403167/ref=sr_1_2?s=books&ie=UTF8&qid=1515119118&sr=1-2&keywords=philip+sossou')
    }, 
    {
      bookImg: this.sanitize.bypassSecurityTrustStyle("background:url('../../../assets/books/book4.png') no-repeat center;background-size: contain;"),
      title:"Critics of Daisy Miller",
      src:this.sanitize.bypassSecurityTrustUrl('https://www.amazon.com/Critics-Daisy-Miller-Philip-Sossou/dp/1549870130/ref=sr_1_3?s=books&ie=UTF8&qid=1515119118&sr=1-3&keywords=philip+sossou')
    }, 
    {
      bookImg: this.sanitize.bypassSecurityTrustStyle("background:url('../../../assets/books/book5.jpg') no-repeat center;background-size: contain;"),
      title:"The Roaming Hyena",
      src:this.sanitize.bypassSecurityTrustUrl('https://www.amazon.com/Roaming-Hyena-Philip-C-Sossou-ebook/dp/B075VYHMBQ/ref=sr_1_5?s=books&ie=UTF8&qid=1515119118&sr=1-5&keywords=philip+sossou')
    }
  ]

  ngOnInit() {
  }


}
