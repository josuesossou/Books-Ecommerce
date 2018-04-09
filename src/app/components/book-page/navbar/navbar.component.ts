import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PayoutService } from '../../../services/payout.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  storeLink:boolean;
  isbn;
  uid;

  constructor(
    public route:ActivatedRoute,
    public location:Location,
    public router:Router,
    public payoutService:PayoutService
  ) {}

  ngOnInit() {

    this.router.events.subscribe(event => {

      if(location.pathname === '/perfect-turkey' || location.pathname === '/video' || location.pathname === '/address' || location.pathname === '/confirm' || location.pathname.startsWith('/buy-book-process/')){
        this.storeLink = false;
      }else{
        this.storeLink = true;
      }

    });
   
  }

  login(){
    this.payoutService.loginUsingGoogle().then(()=>{
      this.router.navigate(['/book-purchased'])
    });
  }

}
