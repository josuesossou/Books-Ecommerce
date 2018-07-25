import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs/Subscription';
import ObjectID from 'bson-objectid';

import { BooksDataService } from '../../../../services/books-data.service';
import { PayoutService } from '../../../../services/payout.service';

import { Book } from '../../../../model/book';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {

  private bkSubscription: Subscription;

  invtoryBooks: Book[] = [];
  book: Book;
  seller: string;

  constructor(
    public bkData: BooksDataService,
    public payoutService: PayoutService,
    public route: ActivatedRoute,
    public location: Location,
    public flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.bkSubscription = this.bkData.getInventoryBooks()
    .subscribe((data) => {
      this.invtoryBooks = data;
    });
  }

  ngOnDestroy() {
    this.bkSubscription.unsubscribe();
  }

  // remove a book from the inventory
  removeBck(id) {
    this.bkData.removeFromInv(id);
  }

  // pushing books to the store
  sellBook(book) {
    if (book.price === undefined) {
      this.flashMessage.show('Enter an amount', {cssClass: 'alert-danger', timeout: 1000});
    } else if (book.price <= 1) {
      this.flashMessage.show('Enter an amount higher than $1', {cssClass: 'alert-danger', timeout: 1000});
    } else {
      const id = new ObjectID().toHexString();

      this.bkData.sellBook(id, book).then(() => {
        this.removeBck(book.isbn);
      });
    }
  }
}
