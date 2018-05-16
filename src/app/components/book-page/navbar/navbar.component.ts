import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';
import { PayoutService } from '../../../services/payout.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private authSubsription: Subscription;

  storeLink:boolean;
  isbn;
  uid;
  loginDetails:string;
  isAuth:boolean;

  constructor(
    public route:ActivatedRoute,
    public location:Location,
    public router:Router,
    public payoutService:PayoutService
  ) {}

  ngOnInit() {
    this.authSubsription = this.payoutService.auth().subscribe(auth =>{
      if(!auth || auth.isAnonymous) {
        this.loginDetails = '';
        this.isAuth = false;
      } else{
        this.loginDetails = auth.email 
        this.isAuth = true  
      }
    });
  }

  logout() {
    this.payoutService.logout();
  }

  ngOnDestroy() {
    this.authSubsription.unsubscribe();
  }
}
