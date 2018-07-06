import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})

export class StoreComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private booksSubscription: Subscription;
  private bookSubscription: Subscription;

  constructor(
    public bkData: BooksDataService,
    public payoutService: PayoutService,
    public flashMessage: FlashMessagesService,
    public router: Router,
  ) { }

  books: Book[];
  book: Book;
  uids: String[];
  loader: boolean;
  chipAmount = 1;
  chipPrice = this.chipAmount * 5;

  ngOnInit() {
    this.loader = true;
    this.authSubscription = this.payoutService.auth().subscribe(auth => {
      if (!auth) {
        this.payoutService.loginAnonymously().then(() => {
          this.getAllBooks();
        });
      } else {
        this.getAllBooks();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.booksSubscription.unsubscribe();
    this.bookSubscription.unsubscribe();
  }

  getAllBooks() {
    this.booksSubscription = this.bkData.getUserIds().subscribe(data => {
      this.uids = [];
      for (const d of data) {
        this.uids.push(d.key);
      }
      this.getBooks();
    });
  }

  getBooks() {
    this.books = [];

    for (const id of this.uids) {
      this.bookSubscription = this.bkData.getUserForSaleBooks(id).subscribe(data => {
        for (const d of data) {
          this.book = JSON.parse(d.payload.val());

          this.book.changePrice = false;

          const lastNumb = this.book.image.length - 1;
          this.book.image = this.book.image.slice(4, lastNumb);

          if (this.book.title_long.length > 23) {
            this.book.title_long = this.book.title_long.slice(0, 23) + '...';
          }

          if (this.book.authors[0].length > 14) {
            this.book.authors[0] = this.book.authors[0].slice(0, 14) + '...';
          }
          this.books.unshift(this.book);
        }

        this.books.sort(function(a, b) {
          return b.time - a.time;
        });

        this.loader = false;
      });
    }
  }

  orderStacyChip() {
    if (this.payoutService.user.isAnonymous) {
      return this.flashMessage.show(`Please Login and try again`, {cssClass: 'alert-danger', timeout: 3000});
    }

    if (this.chipAmount < 1 || this.chipAmount > 10) {
      return this.flashMessage.show(`There is no order for 0 amount or less and more than 10`, {cssClass: 'alert-danger', timeout: 3000});
    }

    this.router.navigate([`address/stacy ${this.chipPrice}/${this.payoutService.user.uid}`]);
  }
}
