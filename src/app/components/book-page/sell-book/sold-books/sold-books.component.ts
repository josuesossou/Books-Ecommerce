import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from "rxjs/Subscription";

import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../../services/books-data.service';
import { PayoutService } from '../../../../services/payout.service';

import { Book } from '../../../../model/book';

@Component({
  selector: 'app-sold-books',
  templateUrl: './sold-books.component.html',
  styleUrls: ['./sold-books.component.css']
})
export class SoldBooksComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkSubscription: Subscription;

  book:Book;
  soldBooks:Book[];

  constructor(
    public bkData:BooksDataService,
    public payoutAuth:PayoutService,
    public route:ActivatedRoute,
    public location:Location,
    public flashMessage:FlashMessagesService) { }

  ngOnInit() {
    this.authSubscription = this.payoutAuth.auth().subscribe(auth=>{
      this.bkSubscription = this.bkData.getBookSold(auth.uid).subscribe(data=>{
        this.soldBooks = [];
        for(let d of data){
          this.book = JSON.parse(d.payload.val());
          this.book.isForSale = false;

          this.soldBooks.unshift(this.book);
        }
      })
    })
  }

  ngOnDestroy() {
    this.bkSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
