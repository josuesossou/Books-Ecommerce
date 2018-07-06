import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksDataService } from '../../../services/books-data.service';
import { Subscription } from 'rxjs/Subscription';

import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';

@Component({
  selector: 'app-book-purchases',
  templateUrl: './book-purchases.component.html',
  styleUrls: ['./book-purchases.component.css']
})
export class BookPurchasesComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  // private bkDataSubscription: Subscription;

  purchasedBooks: Book[];
  book: Book;
  user: string;
  boughtTime;
  lessFiveDays: boolean;

  constructor(
    public bkData: BooksDataService,
    public payoutService: PayoutService,
  ) { }

  ngOnInit() {
    const now = new Date().getTime();
    this.payoutService.auth().subscribe(auth => {
      if (auth) {
        this.user = auth.displayName;
        this.bkData.getPurchasedBooks(auth.uid).subscribe(data => {
          this.purchasedBooks = [];
          for (const d of data){
            this.book = JSON.parse(d.payload.val());
            const fiveDays = (now - this.book.boughtTime) / 1000;

            if (fiveDays >= 432000) {
              this.lessFiveDays = false;
            } else {
              this.lessFiveDays = true;
            }
            this.boughtTime = new Date(this.book.boughtTime).toLocaleDateString();
            this.purchasedBooks.unshift(this.book);
          }
        });
      }
    });

  }

  ngOnDestroy() {
    // this.authSubscription.unsubscribe();
    // this.bkDataSubscription.unsubscribe();
  }

}
