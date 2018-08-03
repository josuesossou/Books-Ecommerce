import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';

import { PayoutService } from '../../../services/payout.service';


@Component({
  selector: 'app-buyer-login',
  templateUrl: './buyer-login.component.html',
  styleUrls: ['./buyer-login.component.css']
})
export class BuyerLoginComponent implements OnInit {

  constructor(
    public location: Location,
    public payoutService: PayoutService,
    private router: Router,
    public flashMessage: FlashMessagesService,
    public route: ActivatedRoute
  ) { }

  isVerified = true;
  isRegister = false;
  isLogin = true;
  resendingVirification = false;
  registered = false;

  fullName: string;
  email: string;
  password: string;

  isbn;
  redirectUrl: string;
  buyerLoginUrl: string;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.buyerLoginUrl = `/buyer-login/${id}`;
      this.redirectUrl = `/address/`;
    }else {
      this.buyerLoginUrl = '/buyer-login';
      this.redirectUrl = '/book-purchased';
    }
  }

  onSubmit({value, valid}: {value: Object, valid: boolean}) {
    if (!valid) {
      return this.flashMessage.show('Please fill out the form', {cssClass: 'alert-danger', timeout: 5000});
    }

    if (this.isLogin) {
      this.payoutService.loginWithEmailAndPassword(this.email, this.password, true).then(res => {
        if (!res) {
          return this.isVerified = false;
        }

        this.flashMessage.show('Thank you for your interesting in buying a book from us', {cssClass: 'alert-success ', timout: 5000});
        this.router.navigate([this.redirectUrl]);
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate([this.buyerLoginUrl]);
      });
    }else if (this.isRegister) {
      this.payoutService.register(this.email, this.password, this.fullName).then(res => {
        this.flashMessage.show('A verification Email has been sent. Important! Verify your account before Login in',
                          {cssClass: 'alert-success ', timout: 9000 });
        this.isRegister = false;
        this.resendingVirification = false;
        this.registered = true;
        this.isLogin = true;

        this.router.navigate([this.buyerLoginUrl]);
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate([this.buyerLoginUrl]);
      });
    } else {
      this.payoutService.resendVerificationEmail(this.email, this.password).then(res => {
        this.flashMessage.show(res, {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate([this.buyerLoginUrl]);
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate([this.buyerLoginUrl]);
      });
    }
  }
}
