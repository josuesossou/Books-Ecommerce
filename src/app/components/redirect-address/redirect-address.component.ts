import { Component, OnInit, HostListener } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PayoutService } from '../../services/payout.service';
import { Router } from '@angular/router';
import { Client } from '../../model/interface';
import { Location } from '@angular/common';
import { Charges } from '../../model/interface';


import { environment } from '../../../environments/environment.prod';
import { BooksDataService } from '../../services/books-data.service';

import { Book } from '../../model/book';
import { User } from '../../model/book';

@Component({
  selector: 'app-redirect-address',
  templateUrl: './redirect-address.component.html',
  styleUrls: ['./redirect-address.component.css']
})
export class RedirectAddressComponent implements OnInit {

  client:Client = {
    fullname:'',
    addLine1:'',
    addLine2:'',
    city:'',
    state:'',
    zip:'',
    country:''
  }
  test:Charges;
  id:string;

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
    public flashMessagesService:FlashMessagesService,
    public router:Router,
    public payoutService:PayoutService,
    private location:Location,


    // public route:ActivatedRoute,
    public bkData:BooksDataService,
  ) { 

  }

  ngOnInit() {
    this.payoutService.auth().subscribe((auth)=>{ 
      this.id = auth.uid   
    })
  }

  // updateClient({value, valid}:{value:Client, valid:boolean}){
  //   this.payoutService.checkCharge(this.id).subscribe(charges =>{
  //     if(charges.length == 0){
  //       this.flashMessagesService.show('Payement was canceled', {cssClass:'alert-danger', timeout:5000});
  //       this.router.navigate(['']);
  //     }else{     
  //       for (var i = 0; i < charges.length; i++) {
  //         this.test = charges[i];

  //         if (this.test.amount == 1999 && this.test.charge.amount_refunded == 0 && this.test.charge.paid) {

  //           if (!valid) {
  //             this.flashMessagesService.show('Please fill in all fields', {cssClass:'alert-danger', timeout:2000});
  //             this.router.navigate(['address']);
  //           }else{
  //             this.payoutService.clientAddress(this.id, value);
  //             this.flashMessagesService.show('client successfully Updated', {cssClass:'alert-success', timeout:5000});
  //             this.router.navigate(['/perfect-turkey']);
  //           }
            
  //           break
            
  //         } else{
  //           this.flashMessagesService.show('You need to order a DvD', {cssClass:'alert-danger', timeout:5000});
  //           this.router.navigate(['/perfect-turkey']);
  //         }
  //       }
  //     }
  //   })
  // }

  updateClient({value, valid}:{value:Client, valid:boolean}) {
    this.payoutService.clientAddress(this.id, value).then(() => {

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
    });


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

  @HostListener('window:popstate', ['$event'])
    onPopState(e){   
      if(confirm('Must submit a mailing address')){
        return false
      }else{
        return false
      }
    }
  


}
