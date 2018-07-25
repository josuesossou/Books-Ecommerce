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
  chipPrice = this.chipAmount * (2.75 + 2);
  stacyChip = true;

  ngOnInit() {
    this.loader = true;
    // this.authSubscription = this.payoutService.auth().subscribe(auth => {
    //   if (!auth) {
    //     this.payoutService.loginAnonymously().then(() => {
    //       this.getAllBooks();
    //     });
    //   } else {
    //     this.getAllBooks();
    //   }
    // });
    this.getBooks();
  }

  ngOnDestroy() {
    // this.authSubscription.unsubscribe();
    // this.booksSubscription.unsubscribe();
    this.bookSubscription.unsubscribe();
  }

  // getAllBooks() {
  //   // this.booksSubscription = this.bkData.getUserIds().subscribe(data => {
  //   //   this.uids = [];
  //   //   for (const d of data) {
  //   //     this.uids.push(d.key);
  //   //   }
  //   //   this.getBooks();
  //   // });
  // }

  getBooks() {
    this.books = [];

    this.bookSubscription = this.bkData.getForSaleBooks().subscribe((data: any) => {
      this.books = data;

      this.books.forEach(book => {
        book.changePrice = false;

        const lastNumb = book.image.length - 1;
        book.image = book.image.slice(4, lastNumb);

        if (book.title_long.length > 23) {
          book.title_long = book.title_long.slice(0, 23) + '...';
        }

        if (book.authors[0].length > 14) {
          book.authors[0] = book.authors[0].slice(0, 14) + '...';
        }
      });

      this.books.sort(function(a, b) {
        return b.time - a.time;
      });

      console.log(data, this.books);
      this.loader = false;
    });
  }

  orderStacyChip() {
    if (this.payoutService.user.isAnonymous) {
      console.log('ano');
      return this.flashMessage.show(`Please Login and try again`, {cssClass: 'alert-danger', timeout: 3000});
    }

    if (this.chipAmount < 1) {
      return this.flashMessage.show(`Cannot order an amount lower than 0`, {cssClass: 'alert-danger', timeout: 3000});
    }

    this.router.navigate([`address/stacy ${this.chipPrice}/${this.payoutService.user.uid}`]);
  }
}
