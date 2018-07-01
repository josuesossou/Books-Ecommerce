import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { FlashMessagesService } from 'angular2-flash-messages';

import { Book } from '../../../model/book';
import { Payment } from '../../../model/book';

@Component({
  selector: 'app-buy-book-proccess',
  templateUrl: './buy-book-proccess.component.html',
  styleUrls: ['./buy-book-proccess.component.css']
})

export class BuyBookProccessComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkdataSubscription: Subscription;
  private puchaseSubscription: Subscription;

  isbn;
  uid;
  bUser;
  isStripeViewOn = false;
  buyerEmail: string;

  constructor(
    public route: ActivatedRoute,
    public location: Location,
    public bkData: BooksDataService,
    public payoutService: PayoutService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {

    this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.bUser = this.route.snapshot.paramMap.get('bUser');
    this.authSubscription = this.payoutService.auth().subscribe(auth => {
      this.buyerEmail = auth.email;
    });

    setTimeout(() => {
      this.isStripeViewOn = true;
    }, 2000);

  }

  ngOnDestroy() {
    this.puchaseSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.bkdataSubscription.unsubscribe();
  }

  proccessBuyBook() {
    // this.description = `${d}: Bought ${this.book.isbn} from ${this.book.seller}`;
    // this.description = `${now}: Bought ${this.book.isbn} book from ${this.book.seller}. Posted on: ${postedDate}`;
    this.bkdataSubscription = this.bkData.getForSaleBook(this.isbn, this.uid).subscribe(b => {
      const book: Book = JSON.parse(b.payload.val());
      const postedDate = new Date(book.time).toLocaleDateString();
      const description = `${book.isbn} book from ${book.seller}. Posted on ${postedDate}`;

      if (!book.sold) {

        this.puchaseSubscription = this.payoutService.getAllBckPurchases(this.bUser).subscribe(charges => {
          let chargeDescription;
          let charge: Payment;
          if (!charges || charges.length <= 0) {

            this.router.navigate(['/']);
            this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});

          }else if (charges.length > 0) {

            for (charge of charges) {

              if (charge.description) {
                chargeDescription = charge.description.split(' | ');

                if (description === chargeDescription[1]) {
                  book.sold = true;
                  book.boughtTime = new Date().getTime();
                  book.buyerName = this.buyerEmail;
                  book.buyerUid = this.bUser;

                  // update the book data in the user book in store node
                  this.bkData.updateSoldBook(this.isbn, this.uid, book);
                  // save the book date under the user buying the book
                  this.bkData.saveBuyBook(this.isbn, this.bUser, book);

                  this.router.navigate(['/']);
                  this.flashMessage.show(`Successfully bought ${book.title}`, {cssClass: 'alert-success', timeout: 5000});
                  break;

                }else if (description !== chargeDescription[1]) {
                  this.router.navigate(['/']);
                  this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});
                }
              }
            }

          }else {
            this.router.navigate(['/']);
            this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});
          }
        });

      } else {
        this.router.navigate(['/']);
        this.flashMessage.show(`${book.title} is already sold`, {cssClass: 'alert-danger', timeout: 5000});
      }
    });
  }
}
