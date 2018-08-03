import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// import { environment } from '../../../../environments/environment.prod';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';
import { User } from '../../../model/book';
// import { Charges } from '../../../model/interface';
@Component({
  selector: 'app-buy-book',
  templateUrl: './buy-book.component.html',
  styleUrls: ['./buy-book.component.css']
})
export class BuyBookComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkDataSubscription: Subscription;


  book: Book;
  handler: any;
  price: number;
  description: string;
  userEmail: string;
  name: string;
  loader: boolean;
  userInfo: User;
  userId;
  id;

  isAnomousUser: boolean;

  constructor(
    public route: ActivatedRoute,
    public location: Location,
    public bkData: BooksDataService,
    public payoutService: PayoutService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loader = true;
    // this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.id = this.route.snapshot.paramMap.get('id');

    // this.authSubscription = this.payoutService.auth().subscribe(auth => {
    //   if (!auth) {
    //     return this.router.navigate(['/']);
    //   }

    //   if (auth.isAnonymous) {
    //     this.setBook();
    //     return this.isAnomousUser = true;
    //   }
    //   this.setBook();
    //   return this.isAnomousUser = false;
    // });
    this.bkData.getForSaleBook(this.id).then((bookSnapshot) => {
      // console.log(bookSnapshot.val());
      const book = bookSnapshot.val();
      // const price = book.price * 100;
      // console.log(price);
      this.book = book;
      this.loader = false;
    });
  }

  // setBook() {
  //   let formatPrice: number;
  //   let newFormatPrice;
  //   let now;
  //   let postedDate;

  //   this.bkDataSubscription = this.bkData.getForSaleBook(this.isbn, this.uid).subscribe(book => {
  //     this.book = JSON.parse(book.payload.val());

  //     formatPrice = this.book.price * 100;
  //     newFormatPrice = formatPrice.toString().split('.');
  //     this.price = newFormatPrice[0];
  //     // formating book.time to a local date format
  //     now = new Date().toLocaleString();
  //     postedDate = new Date(this.book.time).toLocaleDateString();
  //     // seting up a description that will be used to track the type of book the user paid for
  //     this.description = `${now} - Bought ${this.book.title} | ${this.book.isbn} book from ${this.book.seller}. Posted on ${postedDate}`;
  //     this.loader = false;
  //   });
  // }

  // fuction that checks if user login or not then runs funtions that confugure and open the stripecheckout view.
  buybook() {
    if (!this.book.sold) {
      if (this.bkData.auth.isAnonymous) {
        this.router.navigate([`/buyer-login/`]);
        return;
      }
      this.router.navigate([`/address/${this.id}`]);
    }
  }

  ngOnDestroy() {
    // this.bkDataSubscription.unsubscribe();
    // this.authSubscription.unsubscribe();
  }
}
