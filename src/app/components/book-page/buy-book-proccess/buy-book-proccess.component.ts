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
import { Charges } from '../../../model/interface';

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
  buyerUser;
  isStripeViewOn = false;
  buyerEmail: string;
  token;

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
    this.buyerUser = this.route.snapshot.paramMap.get('bUser');
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
    if (this.bkdataSubscription) {
      this.bkdataSubscription.unsubscribe();
    }
  }

  proccessBuyBook() {
    this.token = '';

    if (this.isbn === 'stacy') {
      this.puchaseSubscription = this.payoutService.getAllBckPurchases(this.buyerUser).subscribe((charges: Payment[]) => {
        if (!charges || charges.length <= 0) {
          this.router.navigate(['/']);
          this.flashMessage.show(`Failed to purchase Stacy's Chips`, {cssClass: 'alert-danger', timeout: 5000});
        } else if (charges.length > 0) {
          for (let i = 0; i < charges.length; i++) {

            if (charges[i].token.id === this.token) {
              if (charges[i].charge && charges[i].charge.paid) {
                // save the collected data for stacy chip order to the database under buyer user
                const stacyData = {
                  price: (charges[i].amount / 100),
                  amount: (charges[i].amount / 500),
                  description: charges[i].description,
                };

                this.payoutService.saveStacyOrder(this.buyerUser, stacyData);

                this.router.navigate(['/']);
                this.flashMessage.show(`Successfully bought Stacy's Chips`, {cssClass: 'alert-success', timeout: 5000});
                break;
              } else if (!charges[i].charge && i === charges.length - 1) {
                this.router.navigate(['/']);
                this.flashMessage.show(`Failed to purchase Stacy's Chips`, {cssClass: 'alert-danger', timeout: 5000});
                return;
              }
            } else if (!this.token && i === charges.length - 1) {
              this.router.navigate(['/']);
              this.flashMessage.show(`Failed to purchase Stacy's Chips`, {cssClass: 'alert-danger', timeout: 5000});
              return;
            }
          }
        } else {
          this.router.navigate(['/']);
          this.flashMessage.show(`Failed to purchase Stacy's Chips`, {cssClass: 'alert-danger', timeout: 5000});
        }
      });
      return;
    }

    this.bkData.getForSaleBook(this.isbn).then(b => {
      const book: Book = JSON.parse(b.payload.val());
      // const postedDate = new Date(book.time).toLocaleDateString();
      // const description = `${book.isbn} book from ${book.seller} on uzbook.com. Posted on ${postedDate}`;
      console.log(this.token);
      if (!book.sold) {
        this.puchaseSubscription = this.payoutService.getAllBckPurchases(this.buyerUser).subscribe((charges: Payment[]) => {
          if (!charges || charges.length <= 0) {
            this.router.navigate(['/']);
            this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});
          } else if (charges.length > 0) {
            for (let i = 0; i < charges.length; i++) {
              console.log(charges[i]);

              if (charges[i].token.id === this.token) {
                if (charges[i].charge && charges[i].charge.paid) {
                  book.sold = true;
                  book.boughtTime = new Date().getTime();
                  book.buyerName = this.buyerEmail;
                  book.buyerUid = this.buyerUser;

                  // update the book data in the user book in store node
                  this.bkData.updateSoldBook(this.isbn, this.uid, book);
                  // save the book date under the user buying the book
                  this.bkData.saveBuyBook(this.isbn, this.buyerUser, book);

                  this.router.navigate(['/']);
                  this.flashMessage.show(`Successfully bought ${book.title}`, {cssClass: 'alert-success', timeout: 5000});
                  break;
                } else if (!charges[i].charge && i === charges.length - 1) {
                  console.log('first');
                  this.router.navigate(['/']);
                  this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});
                  return;
                }
              } else if (!this.token && i === charges.length - 1) {
                console.log('last');
                this.router.navigate(['/']);
                this.flashMessage.show(`Failed to purchase ${book.title}`, {cssClass: 'alert-danger', timeout: 5000});
                return;
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
