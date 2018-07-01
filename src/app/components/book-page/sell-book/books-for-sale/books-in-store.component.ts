import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../../services/books-data.service';
import { PayoutService } from '../../../../services/payout.service';

import { Book } from '../../../../model/book';

@Component({
  selector: 'app-books-in-store',
  templateUrl: './books-in-store.component.html',
  styleUrls: ['./books-in-store.component.css']
})
export class BooksInStoreComponent implements OnInit, OnDestroy {

  private getBooksSubscription: Subscription;
  private bkSubscription: Subscription;

  forSale: Book[];
  book: Book;

  constructor(
    public bkData: BooksDataService,
    public payoutAuth: PayoutService,
    public route: ActivatedRoute,
    public location: Location,
    public flashMessage: FlashMessagesService,
    public router: Router,
  ) { }

  ngOnInit() {
      const uid = this.payoutAuth.userId;
      this.getBooksSubscription = this.bkSubscription = this.bkData.getUserForSaleBooks(uid).subscribe(data => {
        this.forSale = [];
        for (const d of data){
          this.book = JSON.parse(d.payload.val());
          this.book.changePrice = false;

          this.forSale.unshift(this.book);
        }
      });
  }

  ngOnDestroy() {
    this.bkSubscription.unsubscribe();
    this.getBooksSubscription.unsubscribe();
  }

  changePrice(book) {
    if (book.price === undefined || book.price <= 1) {
      this.flashMessage.show('Enter an amount greater than $1', {cssClass: 'alert-danger', timeout: 4000});
    } else {
      if (!book.sold) {
        book.changePrice = false;
        this.bkData.sellBook(book.isbn, book);
      }
    }
  }

  removeBck(id, book) {
    this.bkData.booksInventory(id, book);
    this.bkData.removeFromStore(id).then(() => {
      this.ngOnInit();
    });
  }

  sendBook(id) {
    this.router.navigate([`send-book/${id}`]);
  }
}
