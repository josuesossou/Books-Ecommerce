import { Component, OnInit } from '@angular/core';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {

  books:Book[];
  book:Book;
  uids:String[];

  constructor(
    public bkData:BooksDataService,
    public payoutService:PayoutService
  ) { }


  ngOnInit() {

    this.payoutService.auth().subscribe(auth=>{
      if(auth){

        this.bkData.getUserIds().subscribe(data=>{
          this.uids = [];
          for(let d of data){
            this.uids.push(d.key);
          }
          this.getBooks();
        });

      }else{

        this.payoutService.loginAnonymously().then(()=>{
          this.bkData.getUserIds().subscribe(data=>{
            this.uids = [];
            for(let d of data){
              this.uids.push(d.key);
            }
            this.getBooks();
          });
        });
        
      }
    })
    
  }


  getBooks(){
    this.books = [];
    for(const id of this.uids){
    
      this.bkData.getUserForSaleBooks(id).subscribe(data=>{
        if(!data)return;

          for(let i = 0; i<9; i++){
            this.book = JSON.parse(data[i].payload.val()); 
            
            let lastNumb = this.book.image.length - 1;
            this.book.image = this.book.image.slice(4,lastNumb);

            this.books.unshift(this.book);
          }
        
      });
    }
  }
}
