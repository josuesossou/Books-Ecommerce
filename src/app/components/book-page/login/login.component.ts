import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

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
    public flashMessage:FlashMessagesService) { }
  email:string;
  password:string;

  ngOnInit() {
  }

  onSubmit(){
    this.payoutService.loginWithEmailAndPassword(this.email, this.password)        
    .then(res=>{
      res.subscribe(userIds=>{
        this.payoutService.auth().subscribe(auth=>{
          if(!userIds.includes(auth.uid)){
            // this.payoutService.logout()
            // location.reload();
            this.flashMessage.show('You are not registered', {cssClass:'alert-danger', timeout:5000});
            return this.router.navigate([`/login`]);
          }
          this.flashMessage.show('You have looged in', {cssClass:'alert-success ', timout:5000});
          this.router.navigate([`/sell-book`]);
        })
      })
   
    })
    .catch(err =>{
      this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
      this.router.navigate(['/login']);
    })
  }

}
