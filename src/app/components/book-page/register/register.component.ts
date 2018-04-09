import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

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
  passwordDonMatch:boolean = false;

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
      this.payoutService.register(this.email, this.password, this.fullName)
        .then(res=>{
          this.flashMessage.show('You have been successfully registered', {cssClass:'alert-success ', timout:5000});
          this.router.navigate(['/sell-book']);
        })
        .catch(err =>{
          this.flashMessage.show(err.message, {cssClass:'alert-danger', timeout:5000});
          this.router.navigate(['/register']);
        })

    }else{
      this.passwordDonMatch = true;
    }
  }

}
