import { Component, OnInit } from '@angular/core';

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
export class LoginComponent implements OnInit {

  constructor(    
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    public router:Router,
    public location:Location,
    public flashMessage:FlashMessagesService
  ) { }
  email:string;
  password:string;
  isVerified:boolean = true;
  resendingVirification:boolean = false;

  ngOnInit() {
  }

  onSubmit(){
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
        console.log(res)
        if (!res) return  this.isVerified = false;

        res.subscribe((userIds:UserData[])=>{
          this.payoutService.auth().subscribe(auth=>{
            const uids = userIds.filter((userId) => userId.uid === auth.uid);

            if(uids.length === 0){
              return this.flashMessage.show('Your account is not registered as seller account', {cssClass:'alert-danger', timeout:5000});
            }

            this.flashMessage.show('You are logged in', {cssClass:'alert-success ', timout:5000});
            this.router.navigate(['/sell-book']);
          })
        })
      }).catch(err => {
        this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['/login']);
      });
  }

}
