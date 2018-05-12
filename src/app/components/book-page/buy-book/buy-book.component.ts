import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
export class BuyBookComponent implements OnInit {

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
    let formatPrice:number;
    let newFormatPrice;
    let lastNumb;
    let now;
    let postedDate;
    this.bkData.getForSaleBook(this.isbn, this.uid).subscribe(book=>{
      this.book = JSON.parse(book.payload.val());
      //slicing the image url from url()---> saved in firebase as url(http...)
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
    });
  }


//fuction that checks if user login or not then runs funtions that confugure and open the stripecheckout view.
  buybook(){
    if(!this.book.sold){

      this.payoutService.auth().subscribe(auth=>{
        if(!auth || auth.displayName == null){
          this.payoutService.loginUsingGoogle().then((res)=>{
            this.userInfo = res;
            
            this.userId = this.userInfo.user.uid;
            this.name = this.userInfo.user.displayName;
            this.userEmail = this.userInfo.user.email;

            return this.name;
          }).then(()=>{
            this.configureStripeCheckout();
          });
          
          return;
        }
        this.name = auth.displayName;
        this.userId = auth.uid;
        this.userEmail = auth.email;
        this.configureStripeCheckout();
      });

    }
  }

  configureStripeCheckout(){

    this.handler = StripeCheckout.configure({
      key: environment.stripekey,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      locale: "auto",
      email:this.userEmail,
      token: token => {
        this.payoutService.processBookPayment(token, this.price, this.description, this.userEmail)
      }
    });
    this.handlePayment(this.name, this.book.title);
  }

  handlePayment(name, describe) {
    this.bkData.getForSaleBook(this.isbn, this.uid).subscribe(book=>{
      let nbook:Book = JSON.parse(book.payload.val());
      if(!nbook.sold){
        this.handler.open({
          name: 'Login as '+name,
          description: "Buying "+ describe,
          amount: this.price
        });
        
        this.router.navigate([`buy-book-process/${this.uid}/${this.isbn}/${this.userId}`]);
      } 
    })
  }


}
