import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PayoutService } from '../../services/payout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../model/interface';


import { environment } from '../../../environments/environment.prod';
import { BooksDataService } from '../../services/books-data.service';

import { Book } from '../../model/book';
import { User } from '../../model/book';

@Component({
  selector: 'app-redirect-address',
  templateUrl: './redirect-address.component.html',
  styleUrls: ['./redirect-address.component.css']
})
export class RedirectAddressComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkSubscription: Subscription;

  client: Client = {
    fullname: '',
    addLine1: '',
    addLine2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  };

  book: Book;
  handler: any;
  price: number;
  description: string;
  userEmail: string;
  name: string;
  loader: boolean;
  userInfo: User;
  userId;
  isbn;
  splitIsbn;
  id;
  boughtStacyTime;

  constructor(
    public flashMessagesService: FlashMessagesService,
    public router: Router,
    public payoutService: PayoutService,
    public bkData: BooksDataService,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.loader = true;
    this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.id = this.route.snapshot.paramMap.get('id');

    let formatPrice: number;
    let newFormatPrice;
    let now;
    let postedDate;
    this.splitIsbn = this.isbn.split(' ');
    const auth = this.bkData.auth;

    if (auth.isAnonymous) {
      this.router.navigate(['/']);
      this.loader = false;
      return;
    }

    if (this.splitIsbn[0] === 'stacy') {
      now = new Date().toLocaleString();
      this.boughtStacyTime = new Date().getTime();

      console.log(this.boughtStacyTime);

      this.description = `${now} - Bought Stacy's Chips | on uzbook.com on ${new Date().toLocaleDateString()}`;
      this.price = this.splitIsbn[1] * 100,
      this.loader = false;
    };

    // this.authSubscription = this.payoutService.auth().subscribe((auth) => {
    //   if (!auth || auth.isAnonymous) {
    //     this.router.navigate(['/']);
    //     this.loader = false;
    //     return;
    //   } else if (this.splitIsbn[0] === 'stacy') {
    //     now = new Date().toLocaleString();
    //     this.boughtStacyTime = new Date().getTime();

    //     console.log(this.boughtStacyTime);

    //     this.description = `${now} - Bought Stacy's Chips | on uzbook.com on ${new Date().toLocaleDateString()}`;
    //     this.price = this.splitIsbn[1] * 100,
    //     this.loader = false;
    //   } else {
    //     this.bkData.getForSaleBook(this.id).then(book => {
    //       this.book = JSON.parse(book.payload.val());

    //       if (!this.book) {
    //         return this.router.navigate(['/']);
    //       }

    //       if (this.book.sold) {
    //         return this.router.navigate(['/']);
    //       }
    //       formatPrice = this.book.price * 100;
    //       newFormatPrice = formatPrice.toString().split('.');
    //       this.price = newFormatPrice[0];
    //       // formating book.time to a local date format
    //       now = new Date().toLocaleString();
    //       postedDate = new Date(this.book.time).toLocaleDateString();
    //       // seting up a description that will be used to track the type of book the user paid for
    //       this.description = `${now} - Bought ${this.book.title} |
    //                            ${this.book.isbn} book from ${this.book.seller} on uzbook.com. Posted on ${postedDate}`;
    //       this.loader = false;
    //     });
    //   }

    //   this.userId = auth.uid;
    //   this.userEmail = auth.email;
    // });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    if (this.bkSubscription) {
      this.bkSubscription.unsubscribe();
    }
  }

  updateClient({value, valid}: {value: Client, valid: boolean}) {
    if (!valid) {
      return;
    }
    if (this.splitIsbn[0] === 'stacy') {
      this.payoutService.clientAddressStacys(this.userId, value).then(() => {
        this.configureStripeCheckout(`Stacy's Chips`);
      });
    } else {
      this.payoutService.clientAddress(this.userId, value).then(() => {
        this.configureStripeCheckout(this.book.title);
      });
    }
  }

  configureStripeCheckout(describe) {
    this.handler = StripeCheckout.configure({
      key: environment.stripekey,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      email: this.userEmail,
      token: token => {
        this.payoutService.processBookPayment(token, this.price, this.description, this.userEmail);
      }
    });
    this.handlePayment(this.userEmail, describe);
  }

  handlePayment(name, describe) {
    this.handler.open({
      name: 'Login as ' + name,
      description: 'Buying ' + describe,
      amount: this.price
    });
    if (this.splitIsbn && this.splitIsbn[0] === 'stacy') {
      this.router.navigate([`buy-book-process/${this.boughtStacyTime}/stacy/${this.userId}`]);
    } else {
      this.router.navigate([`buy-book-process/${this.id}/${this.isbn}/${this.userId}`]);
    }
  }

  @HostListener('window:popstate', ['$event'])
    onPopState() {
      if (confirm('Do you want to leave this page? Purchase will be canceled')) {
        return false;
      }else {
        return true;
      }
    }
}
