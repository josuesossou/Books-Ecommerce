import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';
import { UserData } from '../../../model/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private dataSubscription: Subscription;

  constructor(    
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    public router:Router,
    public location:Location,
    public flashMessage:FlashMessagesService,
  ) { }
  email:string;
  password:string;
  isVerified:boolean = true;
  resendingVirification:boolean = false;

  uid;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSubmit({value, valid}:{value:Object, valid:boolean}){
    if (!valid) return this.flashMessage.show('Please fill out the form', {cssClass:'alert-danger', timeout:5000});

    if (this.resendingVirification){
      this.payoutService.resendVerificationEmail(this.email, this.password).then(res => {
        this.flashMessage.show(res, {cssClass:'alert-success', timeout:5000});
        this.router.navigate(['/login']);
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/login']);
      });
      return;
    }

    this.payoutService.loginWithEmailAndPassword(this.email, this.password, false)        
      .then(res => {
        if (!res) return  this.isVerified = false;

        this.authSubscription = this.payoutService.auth().subscribe(auth => {
          this.uid = auth.uid
        });

        this.dataSubscription = res.subscribe((userIds:UserData[])=>{
          const uids = userIds.filter((userId) => userId.uid === this.uid);

          if(uids.length === 0){
            this.authSubscription.unsubscribe();
            this.dataSubscription.unsubscribe();
            return this.flashMessage.show('Your account is not registered as seller account', {cssClass:'alert-danger', timeout:5000});
          }

          this.flashMessage.show('You are logged in', {cssClass:'alert-success ', timout:5000});

          this.authSubscription.unsubscribe();
          this.dataSubscription.unsubscribe();
          this.router.navigate(['/sell-book']);
        });

      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/login']);
      });
  }

}
