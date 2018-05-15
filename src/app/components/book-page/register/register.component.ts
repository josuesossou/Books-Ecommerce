import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { UserData } from '../../../model/interface'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  fullName:string;
  email:string;
  password:string;
  repassword:string;
  passwordDonMatch:boolean;
  business:string;

  constructor(
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    public router:Router,
    public location:Location,
    public flashMessage:FlashMessagesService) { }

  ngOnInit() {
  }

  onSubmit(){
    if(this.password === this.repassword){
      this.passwordDonMatch = false;
      const userData:UserData = {
        fullName: this.fullName,
        email: this.email,
        business: this.business,
      }

      this.payoutService.register(this.email, this.password, this.business, userData)
        .then(res=>{
          this.flashMessage.show('A verification Email has been sent. Important! Verify your account before Login in',
                                 {cssClass:'alert-success ', timout:9000});
          this.router.navigate(['/login']);
        }).catch(err => {

          if (err.code === 'auth/email-already-in-use') {
            this.flashMessage.show('Your account is not registered as seller account', {cssClass:'alert-danger', timeout:5000});

            if(confirm('Would you like to register to seller Account?')) {
              return this.payoutService.loginWithEmailAndPassword(this.email, this.password, false).then(res => {
                if (!res) return this.flashMessage.show('Your account is not verified, therefore removed.', {cssClass:'alert-danger', timeout:5000});

                this.payoutService.auth().subscribe(auth => {
                  this.payoutService.updateRegister(auth.uid, userData);
                  this.router.navigate(['/sell-book']);
                });
                return;
              });
            } else {
              this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
              this.router.navigate(['/register']);

              return;
            }
          }

          this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
          this.router.navigate(['/register']);
        })

    }else{
      this.passwordDonMatch = true;
    }
  }

}
