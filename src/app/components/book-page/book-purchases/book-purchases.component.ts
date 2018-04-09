import { Component, OnInit } from '@angular/core';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';

@Component({
  selector: 'app-book-purchases',
  templateUrl: './book-purchases.component.html',
  styleUrls: ['./book-purchases.component.css']
})
export class BookPurchasesComponent implements OnInit {

  purchasedBooks:Book[];
  book:Book;
  user:string;
  boughtTime;

  constructor(
    public bkData:BooksDataService,
    public payoutService:PayoutService,) { }

  ngOnInit() {

    this.payoutService.auth().subscribe(auth=>{
      if(auth){
        this.user = auth.displayName;
        this.bkData.getPurchasedBooks(auth.uid).subscribe(data=>{
          this.purchasedBooks = [];
          for(let d of data){
            this.book = JSON.parse(d.payload.val());
            this.boughtTime = new Date(this.book.boughtTime).toLocaleDateString()
            this.purchasedBooks.unshift(this.book);
          }
        })
      }
    });

  }

}
