import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { PayoutService } from '../../../services/payout.service';


@Component({
  selector: 'app-buyer-login',
  templateUrl: './buyer-login.component.html',
  styleUrls: ['./buyer-login.component.css']
})
export class BuyerLoginComponent implements OnInit {

  constructor(
    public location:Location,
    public payoutService:PayoutService,
    private router:Router,
    public flashMessage:FlashMessagesService
  ) { }

  isVerified:boolean = true;
  isRegister:boolean = false;
  isLogin:boolean = true;
  resendingVirification:boolean = false;
  
  fullName:string;
  email:string;
  password:string;

  ngOnInit() {
  }

  onSubmit() {
    if (this.isLogin) {
      console.log('login');
      this.payoutService.loginWithEmailAndPassword(this.email, this.password, true).then(res => {
        if (!res) return this.isVerified = false;
  
        this.flashMessage.show('Thank you for your interesting in buying a book from us', {cssClass:'alert-success ', timout:5000});
        this.router.navigate(['/address']);
      }).catch(err => {
        console.log(err);
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/buyer-login']);
      });
    }else if(this.isRegister){
      console.log('register');
      this.payoutService.register(this.email, this.password, this.fullName).then(res => {
        this.flashMessage.show('A verification Email has been sent. Important! Verify your account before Login in',
                          {cssClass:'alert-success ', timout:9000 });
        this.router.navigate(['/buyer-login']);
        this.isRegister = false;
        this.resendingVirification =false
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/buyer-login']);
      });
    } else {
      console.log('sending verification');
      this.payoutService.resendVerificationEmail(this.email, this.password).then(res => {
        console.log('success', res)
        this.flashMessage.show(res, {cssClass:'alert-success', timeout:5000});
        this.router.navigate(['/buyer-login']);
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/buyer-login']);
      });
    }
  }

  onRegister() {

  }
}
