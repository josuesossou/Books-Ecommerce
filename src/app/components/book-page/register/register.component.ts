import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { UserData } from '../../../model/interface';
import { Client } from '../../../model/interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  fullName: string;
  email: string;
  password: string;
  repassword: string;
  passwordDonMatch: boolean;
  business: string;
  stripeId: string;

  client: Client = {
    addLine1: '',
    addLine2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  };

  loader = false;

  constructor(
    public bkData: BooksDataService,
    public payoutService: PayoutService,
    public router: Router,
    public location: Location,
    public flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onSubmit({value, valid}: {value: Object, valid: boolean}) {
    if (!valid) {
      return this.flashMessage.show('Please fill out the form', {cssClass: 'alert-danger', timeout: 5000});
    }

    this.loader = true;

    if (this.password === this.repassword) {
      this.passwordDonMatch = false;

      const userData: UserData = {
        fullName: this.fullName,
        email: this.email,
        business: this.business,
        address: this.client,
        stripeId: this.stripeId,
      };

      this.payoutService.register(this.email, this.password, this.business, userData)
        .then(() => {
          this.flashMessage.show('A verification Email has been sent. Important! Verify your account before Login in',
                                 {cssClass: 'alert-success ', timout: 9000});
          this.router.navigate(['/login']);
        }).catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            if (confirm('You already have an Account that has not been registered. Would you like to register now?')) {
              this.payoutService.loginWithEmailAndPassword(this.email, this.password, false).then(res => {
                if (!res) {
                  return this.flashMessage.show(
                    'Your account is not verified, therefore it was removed.',
                    {cssClass: 'alert-danger', timeout: 5000});
                }
                this.flashMessage.show('You successfully registered', {cssClass: 'alert-success', timeout: 5000});
                this.payoutService.updateProfile(this.business, userData);
                this.router.navigate(['/sell-book']);
                this.loader = false;
              });
            }
          } else {
            this.flashMessage.show(err.message, {cssClass: 'alert-danger', timeout: 5000});
            this.router.navigate(['/register']);
            this.loader = false;
          }
        });
    } else {
      this.passwordDonMatch = true;
      this.loader = false;
    }
  }
}
