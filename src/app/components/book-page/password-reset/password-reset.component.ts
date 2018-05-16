import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  email:string;
  constructor(
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    public router:Router,
    public location:Location,
    public flashMessage:FlashMessagesService) { }

  ngOnInit() {
  }

  resetPassword() {
    this.payoutService.resetPassword(this.email).then(res => {
      this.flashMessage.show(res, {cssClass:'alert-success ', timout:5000});
    }).catch(e => {
      this.flashMessage.show(e.messages, {cssClass:'alert-success ', timout:5000});
    })
  }

}
