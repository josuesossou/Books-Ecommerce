import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PayoutService } from '../../services/payout.service';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { Charges } from '../../model/interface';

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
  styleUrls: ['./top-content.component.css']
})
export class TopContentComponent implements OnInit {

  onlinePrice:number = 1099;
  dvdPrice:number = 1999;
  isWatchOnline:boolean;

  isAuth:boolean = false;

  //The charges object values from firebase is being stored in the test object variable
  //it's purpose is to check whether the client has already paid and which version(watch online or order dvd)
  //sorry for not being descriptive to with this variable
  test:Charges;

  id:string;

  handler:any;
  amount:number;
  email:string;

  sdOnlineVideo:string = 'Purchase Online Perfect Turkey learning video';

  sdDvDVideo:string = 'Order a DVD for Perfect Turkey learning video'


  constructor(
    private payoutService:PayoutService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  // proceedPayement(price){
    
  //   if (price == 1099) {

  //     this.isWatchOnline = true;
      
  //     this.payoutService.loginUsingGoogle().then(res=>{

  //     this.payoutService.auth().subscribe((auth)=>{    
  //       this.email = auth.email;
  //         this.payoutService.checkCharge(auth.uid).subscribe(charges =>{

  //             if (charges.length == 0) {

  //               this.handler = StripeCheckout.configure({
  //                 key: environment.stripekey,
  //                 image: "https://stripe.com/img/documentation/checkout/marketplace.png",
  //                 locale: "auto",
  //                 email: this.email,
  //                 token: token => {
  //                   this.payoutService.processPayment(token, price, "Perfect turkey", this.email)
  //                 }
  //               });
                
  //               this.handlePayment(auth.displayName, price, this.sdOnlineVideo);

  //             } else {
  
  //               for (var i = 0; i < charges.length; i++) {

  //                 this.test = charges[i];
              
  //                 if (this.test.charge.amount_refunded == 0 && this.test.charge.paid) {

  //                   this.router.navigate(['video']);

  //                   break

  //                 } else{

  //                   alert('An error has occuured');

  //                   break
  //                 }
                              
  //             }

  //           }

  //         });
      
  //       })

  //     })

  //   }else if(price == 1999 ){

  //     this.isWatchOnline = false;
  //     this.payoutService.loginUsingGoogle().then(res=>{
        
  //       this.payoutService.auth().subscribe((auth)=>{       
          
  //         this.payoutService.checkCharge(auth.uid).subscribe(charges =>{
            
  //           if (charges.length == 0) {

  //             this.handler = StripeCheckout.configure({
  //               key: environment.stripekey,
  //               image: "https://stripe.com/img/documentation/checkout/marketplace.png",
  //               locale: "auto",
  //               email: this.email,
  //               token: token => {
  //                 this.payoutService.processPayment(token, price, "turkey", this.email,)
  //               }
  //             });
              
  //             this.handlePayment(auth.displayName, price, this.sdDvDVideo);

  //           } else {

  //             for (var i = 0; i < charges.length; i++) {
  //               this.test = charges[i]
  //               if (this.test.amount == 1999 && this.test.charge.paid && this.test.charge.amount_refunded == 0) {
  //                 return alert('Already Ordered');
  //               } else{

  //                 this.handler = StripeCheckout.configure({
  //                   key: environment.stripekey,
  //                   image: "https://stripe.com/img/documentation/checkout/marketplace.png",
  //                   locale: "auto",
  //                   email: this.email,
  //                   token: token => {
  //                     this.payoutService.processPayment(token, price, "turkey", this.email,)
  //                   }
  //                 });

  //                 this.handlePayment(auth.displayName, price, this.sdDvDVideo);
  //                 break
  //               }
                            
  //             }

  //           } 

  //         });
      
  //       })

  //     })

  //   }else{
  //     return alert('Price not accepted')
  //   }

    
  // }

  // handlePayment(name, price,describe) {
    
  //   this.handler.open({
  //     name: 'Login as '+ name,
  //     description: describe,
  //     amount: price
  //   });

  
  //   if(this.isWatchOnline){
  //     this.router.navigate(['confirm']);
  //   }else {
  //     this.router.navigate(['address']);
  //   }
    
  // }
  
  

  // logout(){
  //   this.payoutService.logout()
  // }
    

}
