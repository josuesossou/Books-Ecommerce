import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

import { environment } from '../../../../environments/environment.prod';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';
import { User } from '../../../model/book';
import { Charges } from '../../../model/interface';
@Component({
  selector: 'app-buy-book',
  templateUrl: './buy-book.component.html',
  styleUrls: ['./buy-book.component.css']
})
export class BuyBookComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkDataSubscription: Subscription;


  book:Book;
  handler:any;
  price:number;
  description:string;
  userEmail:string;
  name:string;
  loader:boolean;
  userInfo:User;
  userId;
  isbn;
  uid;

  isAnomousUser:boolean;

  constructor(
    public route:ActivatedRoute,
    public location:Location,
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.loader = true;
    this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.uid = this.route.snapshot.paramMap.get('uid');

    this.authSubscription = this.payoutService.auth().subscribe(auth => {
      if (!auth) return this.router.navigate(['/']);

      if (auth.isAnonymous) {
        this.setBook()
        return this.isAnomousUser = true;
      }
      this.setBook()
      return this.isAnomousUser = false;
    });

  }

  setBook() {
    let formatPrice:number;
    let newFormatPrice;
    let lastNumb;
    let now;
    let postedDate;
    
    this.bkDataSubscription = this.bkData.getForSaleBook(this.isbn, this.uid).subscribe(book => {
      this.book = JSON.parse(book.payload.val());
      // slicing the image url from url()---> saved in firebase as url(http...)
      lastNumb = this.book.image.length - 1;
      //formating the price so that if the user enter a price that will not be acceptable through stripe because of '.', this code will remove any '.' and numbers after the dot
      formatPrice = this.book.price * 100;
      newFormatPrice = formatPrice.toString().split('.');
      this.price = newFormatPrice[0];
      //formating book.time to a local date format
      now = new Date().toLocaleString();
      postedDate = new Date(this.book.time).toLocaleDateString();
      //seting up a description that will be used to track the type of book the user paid for
      this.description = `${now} - Bought ${this.book.title} | ${this.book.isbn} book from ${this.book.seller}. Posted on ${postedDate}`;
      this.loader = false;
    })
  }
//fuction that checks if user login or not then runs funtions that confugure and open the stripecheckout view.
  buybook(){
    if(!this.book.sold){
      if (this.isAnomousUser) {
        this.router.navigate([`/buyer-login/${this.isbn}/${this.uid}`]);
        return;
      } 
      this.router.navigate([`/address/${this.isbn}/${this.uid}`]);
    }
  }

  ngOnDestroy() {
    this.bkDataSubscription.unsubscribe();
    this.authSubscription.unsubscribe()
  }

}
